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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { LabelHelp } from "@/components/dashboard/LabelHelp";

export function Inventory() {
  const { control, watch } = useFormContext();
  const manageStock = watch("manage_stock");

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    SKU (Stock Keeping Unit) <LabelHelp>A unique identifier for each distinct product and service that can be purchased.</LabelHelp>
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={control}
            name="stock_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Stock Status <LabelHelp>Control whether the product is listed as in stock or out of stock.</LabelHelp>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "instock"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                    <SelectItem value="onbackorder">On Backorder</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="manage_stock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                
                <FormLabel>
                  Enable product stock management <LabelHelp>Check this to track exact quantity of items available.</LabelHelp>
                </FormLabel>
                <FormDescription>
                   Track stock quantity for this product.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {manageStock && (
             <FormField
             control={control}
             name="stock_quantity"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>
                    Stock Quantity <LabelHelp>How many items do you have in stock?</LabelHelp>
                 </FormLabel>
                 <FormControl>
                   <Input type="number" placeholder="0" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
        )}
      </CardContent>
    </Card>
  );
}
