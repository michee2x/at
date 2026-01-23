"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelHelp } from "@/components/dashboard/LabelHelp";
import { useFormContext } from "react-hook-form";

export function Shipping() {
  const { control, watch } = useFormContext();
  const requiresShipping = watch("requires_shipping");

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Shipping and Tax</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
         <FormField
          control={control}
          name="requires_shipping"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                
                <FormLabel>
                   This product requires shipping <LabelHelp>Uncheck if this is a service or digital product that doesn't need delivery.</LabelHelp>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {requiresShipping && (
            <div className="space-y-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                        control={control}
                        name="weight"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Weight (kg)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="dimensions.length"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Length (cm)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="dimensions.width"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Width (cm)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="dimensions.height"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Height (cm)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                 
                  <FormField
                        control={control}
                        name="shipping_class"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Shipping Class <LabelHelp>Select a shipping class if you have different shipping rates for different types of products.</LabelHelp>
                            </FormLabel>
                            <FormControl>
                            <Input placeholder="No shipping class" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
