"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";

export function OtherOptions() {
  const { control } = useFormContext();

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Other Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "publish"}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="publish">Internet (Publish)</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

             <FormField
                control={control}
                name="catalog_visibility"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "visible"}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="visible">Visible</SelectItem>
                        <SelectItem value="catalog">Catalog only</SelectItem>
                        <SelectItem value="search">Search only</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

         <FormField
            control={control}
            name="purchase_note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Customer will get this info in their order email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         <FormField
          control={control}
          name="enable_reviews"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Enable product reviews
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
