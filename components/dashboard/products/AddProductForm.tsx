"use client";

import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { type ImageFile } from "@/components/dashboard/ImageUpload";
import { CoverImageUpload } from "@/components/dashboard/CoverImageUpload";
import { GalleryImageUpload } from "@/components/dashboard/GalleryImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"; // For ImageUpload wrapper

// Form Sections
import { GeneralInfo } from "./form-sections/GeneralInfo";
import { ProductTypeFields } from "./form-sections/ProductTypeFields";
import { Pricing } from "./form-sections/Pricing";
import { Inventory } from "./form-sections/Inventory";
import { Shipping } from "./form-sections/Shipping";
import { Organization } from "./form-sections/Organization";
import { OtherOptions } from "./form-sections/OtherOptions";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["simple", "variable", "external", "grouped"]).default("simple"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  
  // Simple Product
  downloadable: z.boolean().default(false),
  virtual: z.boolean().default(false),
  
  // External Product
  external_url: z.string().optional(),
  button_text: z.string().optional(),
  
  regular_price: z.string().min(1, "Price is required"),
  sale_price: z.string().optional(),
  
  sku: z.string().optional(),
  stock_status: z.string().optional(),
  manage_stock: z.boolean().default(false),
  stock_quantity: z.string().optional(),
  
  requires_shipping: z.boolean().default(true),
  weight: z.string().optional(),
  dimensions: z.object({
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
  }).optional(),
  shipping_class: z.string().optional(),

  categories: z.array(z.number()).default([]),
  brand: z.string().optional(),
  // tags
  
  status: z.string().default("publish"),
  catalog_visibility: z.string().default("visible"),
  purchase_note: z.string().optional(),
  enable_reviews: z.boolean().default(true),
  
  // Split Image Fields
  cover_image: z.custom<ImageFile>().nullable().optional(),
  gallery_images: z.array(z.custom<ImageFile>()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      type: "simple",
      short_description: "",
      description: "",
      downloadable: false,
      virtual: false,
      external_url: "",
      button_text: "Buy product",
      regular_price: "",
      manage_stock: false,
      requires_shipping: true,
      status: "publish",
      catalog_visibility: "visible",
      enable_reviews: true,
      cover_image: null,
      gallery_images: [],
    } as any,
  });

  // Use useWatch instead of watch for better reactivity
  const productType = useWatch({ control: methods.control, name: "type" });
  const isVirtual = useWatch({ control: methods.control, name: "virtual" });

  async function uploadImage(imageFile: ImageFile): Promise<number> {
    const formData = new FormData();
    formData.append("file", imageFile.file);

    const uploadRes = await fetch("/api/vendor/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Image upload failed:", errText);
      throw new Error(`Failed to upload ${imageFile.file.name}`);
    }

    const uploadData = await uploadRes.json();
    return uploadData.id;
  }

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);

    try {
      const uploadedImageIds: number[] = [];
      let totalImagesToUpload = 0;

      if (data.cover_image) totalImagesToUpload++;
      if (data.gallery_images) totalImagesToUpload += data.gallery_images.length;

      if (totalImagesToUpload > 0) {
        toast.info(`Uploading ${totalImagesToUpload} image(s)...`);

        // 1. Upload Cover Image
        if (data.cover_image) {
          try {
             const coverId = await uploadImage(data.cover_image);
             uploadedImageIds.push(coverId);
          } catch (e) {
             console.error("Cover upload error", e);
             toast.error("Failed to upload cover image");
             throw e;
          }
        }

        // 2. Upload Gallery Images
        if (data.gallery_images && data.gallery_images.length > 0) {
          for (const img of data.gallery_images) {
            try {
              const galleryId = await uploadImage(img);
              uploadedImageIds.push(galleryId);
            } catch (e) {
              console.error("Gallery upload error", e);
              throw e;
            }
          }
        }

        toast.success("Images uploaded successfully");
      }

      // Step 2: Create product with uploaded image IDs
      const payload = {
         name: data.name,
         type: data.type,
         description: data.description,
         short_description: data.short_description,
         regular_price: data.regular_price,
         sale_price: data.sale_price,
         
         // Simple product specific
         downloadable: data.downloadable,
         virtual: data.virtual,
         
         // External product specific
         external_url: data.external_url,
         button_text: data.button_text,
         
         sku: data.sku,
         stock_status: data.stock_status,
         manage_stock: data.manage_stock,
         stock_quantity: data.stock_quantity ? parseInt(data.stock_quantity) : null,
         
         categories: data.categories.length > 0 ? data.categories.map(id => ({ id })) : [], 
         images: uploadedImageIds.map(id => ({ id })), // Combined IDs (Cover is first)
         
         weight: data.weight,
         dimensions: data.dimensions,
         
         status: data.status,
         catalog_visibility: data.catalog_visibility,
         purchase_note: data.purchase_note,
         reviews_allowed: data.enable_reviews,
      };

      const res = await fetch("/api/vendor/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
         const errText = await res.text();
         throw new Error(errText);
      }

      toast.success("Product created successfully");
      router.push("/dashboard/products");
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
        <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 border-b -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/products">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                        <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Add New Product</h1>
                        <p className="text-sm text-muted-foreground hidden sm:block">Fill in the details to create your listing.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button 
                        onClick={methods.handleSubmit(onSubmit)} 
                        disabled={isLoading}
                        className="bg-[#6a00f3] hover:bg-[#5b00d1]"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </div>
            </div>

            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Left Column (Main Content) */}
                    <div className="xl:col-span-2 space-y-8">
                        <GeneralInfo />
                        
                        
                        {/* Hide Pricing for External & Grouped products */}
                        {productType !== "external" && productType !== "grouped" && <Pricing />}
                        
                        {/* Hide Inventory for External & Grouped products */}
                        {productType !== "external" && productType !== "grouped" && <Inventory />}
                        
                        {/* Hide Shipping for Virtual products or External/Grouped */}
                        {!isVirtual && productType !== "external" && productType !== "grouped" && <Shipping />}
                        
                        <OtherOptions />
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8 xl:sticky xl:top-24">
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Cover Image Section */}
                                <div className="space-y-3">
                                   <FormLabel>Cover Image</FormLabel>
                                   <FormField
                                    control={methods.control}
                                    name="cover_image"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormControl>
                                            <CoverImageUpload 
                                                value={field.value || null} 
                                                onChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>

                                {/* Gallery Images Section */}
                                <div className="space-y-3">
                                   <FormLabel>Gallery Images</FormLabel>
                                   <FormField
                                    control={methods.control}
                                    name="gallery_images"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormControl>
                                            <GalleryImageUpload 
                                                value={field.value} 
                                                onChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Organization />
                    </div>
                </div>
            </form>
        </div>
    </FormProvider>
  );
}
