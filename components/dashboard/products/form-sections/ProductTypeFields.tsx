"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function ProductTypeFields() {
  const { control } = useFormContext();
  const productType = useWatch({ control, name: "type" });

  // DEBUG: Log the product type value
  console.log("🔍 ProductTypeFields rendering, productType:", productType);
  console.log("🔍 productType type:", typeof productType);
  console.log("🔍 productType === 'simple':", productType === "simple");
  console.log("🔍 productType === 'external':", productType === "external");

  // Simple Product: Downloadable & Virtual
  if (productType === "simple") {
    console.log("✅ Rendering Simple Product fields");
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Product Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="downloadable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Downloadable</FormLabel>
                  <FormDescription>
                    Downloadable products give access to files upon purchase.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="virtual"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Virtual</FormLabel>
                  <FormDescription>
                    Virtual products don't require shipping.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  }

  // External/Affiliate Product: URL & Button Text
  if (productType === "external") {
    console.log("✅ Rendering External Product fields");
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>External Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="external_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/product" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter the external URL where customers can purchase this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Buy product" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This text will be shown on the button linking to the external product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  }

  // Variable & Grouped: Placeholder for Phase 2
  if (productType === "variable") {
    console.log("✅ Rendering Variable Product placeholder");
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Variable Product</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Variable product attributes and variations will be implemented in Phase 2.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (productType === "grouped") {
    console.log("✅ Rendering Grouped Product placeholder");
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Grouped Product</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Grouped product selection will be implemented in Phase 2.
          </p>
        </CardContent>
      </Card>
    );
  }

  // FALLBACK: If productType is undefined or doesn't match
  console.log("⚠️ No match found, rendering fallback. ProductType:", productType);
  return (
    <Card className="border-red-500">
      <CardHeader>
        <CardTitle className="text-red-600">Debug: Product Type Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Current productType value: <strong>{String(productType)}</strong></p>
        <p className="text-sm text-muted-foreground">If you see this, the productType value is not matching any condition.</p>
      </CardContent>
    </Card>
  );
}
