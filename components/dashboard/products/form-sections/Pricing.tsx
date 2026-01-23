"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelHelp } from "@/components/dashboard/LabelHelp";
import { useFormContext } from "react-hook-form";

export function Pricing() {
  const { control } = useFormContext();

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="regular_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Regular Price (₦) <LabelHelp>The standard price of the item.</LabelHelp>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Discounted Price <span className="text-xs text-muted-foreground ml-1">(Optional)</span> <LabelHelp>The discounted price customers will pay.</LabelHelp>
                </FormLabel>
                <div className="relative">
                     <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                     </FormControl>
                     {/* Placeholder for Schedule Link/Modal */}
                     <span className="absolute -top-6 right-0 text-xs text-purple-600 cursor-pointer hover:underline">Schedule</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
