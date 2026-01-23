"use client";

import dynamic from "next/dynamic";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "react-quill-new/dist/quill.snow.css";
import { ProductTypeFields } from "./ProductTypeFields";
import { LabelHelp } from "@/components/dashboard/LabelHelp";
import { useFormContext } from "react-hook-form";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export function GeneralInfo() {
  const { control } = useFormContext();

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product Name <LabelHelp>The main title of your product as shown to customers.</LabelHelp>
              </FormLabel>
              <FormControl>
                <Input placeholder="Product name.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product Type <LabelHelp>Choose 'Simple' for physical items, 'Variable' for items with options (like size/color), or 'External' for affiliate products.</LabelHelp>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="simple">Simple Product</SelectItem>
                  <SelectItem value="variable">Variable Product</SelectItem>
                  <SelectItem value="external">External/Affiliate Product</SelectItem>
                  <SelectItem value="grouped">Grouped Product</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProductTypeFields />

        <div className="grid grid-cols-1 gap-6">
           <FormField
            control={control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Short Description <LabelHelp>A brief summary that appears near the top of the product page.</LabelHelp>
                </FormLabel>
                <FormControl>
                  <ReactQuill 
                    theme="snow" 
                    value={field.value || ""} 
                    onChange={field.onChange}
                    className="h-[150px] mb-12" // Margin bottom for toolbar
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    Description <LabelHelp>Detailed information about your product, features, and benefits.</LabelHelp>
                </FormLabel>
                <FormControl>
                  <ReactQuill 
                    theme="snow" 
                    value={field.value || ""} 
                    onChange={field.onChange}
                    className="h-[200px] mb-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
