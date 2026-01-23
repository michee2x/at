"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";

import { CategorySelector } from "@/components/dashboard/CategorySelector";
import { LabelHelp } from "@/components/dashboard/LabelHelp";

// TODO: Fetch from API or use generic list for Brands
const BRANDS = [
    { id: "nike", name: "Nike" },
    { id: "adidas", name: "Adidas" },
    { id: "generic", name: "Generic" },
];

export function Organization() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
        <Card className="border-gray-200 shadow-sm">
        <CardHeader>
            <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
             <FormField
                control={control}
                name="categories" // Changed from 'category' to 'categories' (array)
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Categories <LabelHelp>Select one or more categories that this product belongs to.</LabelHelp>
                    </FormLabel>
                    <FormControl>
                        <CategorySelector 
                            value={field.value || []} 
                            onChange={field.onChange} 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Brand <LabelHelp>Select the brand of the product.</LabelHelp>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {BRANDS.map(brand => (
                            <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
             {/* Tags Input (Placeholder) */}
              <div className="grid gap-2">
                 <FormLabel>
                    Tags <LabelHelp>Add keywords to help customers find your product.</LabelHelp>
                 </FormLabel>
                 <div className="border rounded-md p-2 text-sm text-muted-foreground">
                    Select tags/Add tags
                 </div>
              </div>
        </CardContent>
        </Card>
    </div>
  );
}
