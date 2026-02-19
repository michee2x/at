"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function VariationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sp = Object.fromEntries(searchParams?.entries() || []);

  const [after, setAfter] = useState(sp.after ?? "");
  const [before, setBefore] = useState(sp.before ?? "");
  const [perPage, setPerPage] = useState(sp.per_page ?? "25");
  const [orderby, setOrderby] = useState(sp.orderby ?? "items_sold");

  function apply() {
    const params = new URLSearchParams(
      Object.fromEntries(searchParams?.entries() || []),
    );
    if (after) params.set("after", after);
    else params.delete("after");
    if (before) params.set("before", before);
    else params.delete("before");
    params.set("per_page", perPage);
    params.set("orderby", orderby);
    router.replace(`${location.pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="flex gap-2 items-center">
        <label className="text-sm text-muted-foreground">From</label>
        <Input
          type="datetime-local"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
          className="w-[220px]"
        />
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-muted-foreground">To</label>
        <Input
          type="datetime-local"
          value={before}
          onChange={(e) => setBefore(e.target.value)}
          className="w-[220px]"
        />
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-muted-foreground">Show</label>
        <Select value={perPage} onValueChange={(v) => setPerPage(v)}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-muted-foreground">Order By</label>
        <Select value={orderby} onValueChange={(v) => setOrderby(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="items_sold">Items Sold</SelectItem>
            <SelectItem value="net_revenue">Net Revenue</SelectItem>
            <SelectItem value="orders_count">Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button onClick={apply}>Apply</Button>
      </div>
    </div>
  );
}
