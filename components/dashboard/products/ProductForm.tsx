"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { type ImageFile } from "@/components/dashboard/ImageUpload";
import { CoverImageUpload } from "@/components/dashboard/CoverImageUpload";
import { GalleryImageUpload } from "@/components/dashboard/GalleryImageUpload";
import { ProductCreationLoader } from "@/components/dashboard/ProductCreationLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"; 

// Form Sections
import { GeneralInfo } from "@/components/dashboard/products/form-sections/GeneralInfo";
import { ProductTypeFields } from "@/components/dashboard/products/form-sections/ProductTypeFields";
import { Pricing } from "@/components/dashboard/products/form-sections/Pricing";
import { Inventory } from "@/components/dashboard/products/form-sections/Inventory";
import { Shipping } from "@/components/dashboard/products/form-sections/Shipping";
import { Organization } from "@/components/dashboard/products/form-sections/Organization";
import { OtherOptions } from "@/components/dashboard/products/form-sections/OtherOptions";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["simple", "variable", "external", "grouped"]),
  short_description: z.string().optional(),
  description: z.string().optional(),
  
  // Simple Product
  downloadable: z.boolean(),
  virtual: z.boolean(),
  
  // External Product
  external_url: z.string().optional(),
  button_text: z.string().optional(),
  
  regular_price: z.string().min(1, "Price is required"),
  sale_price: z.string().optional(),
  
  sku: z.string().optional(),
  stock_status: z.string().optional(),
  manage_stock: z.boolean(),
  stock_quantity: z.string().optional(),
  
  requires_shipping: z.boolean(),
  weight: z.string().optional(),
  dimensions: z.object({
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
  }).optional(),
  shipping_class: z.string().optional(),

  categories: z.array(z.number()),
  brand: z.string().optional(),
  // tags
  
  status: z.string(),
  catalog_visibility: z.string(),
  purchase_note: z.string().optional(),
  enable_reviews: z.boolean(),
  
  // Split Image Fields
  cover_image: z.custom<ImageFile>().nullable().optional(),
  gallery_images: z.array(z.custom<ImageFile>()),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: any; // We'll refine this type usually, but for WP API responses 'any' is arguably safer initially
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  
  // Loading State
  const [loadingState, setLoadingState] = useState<"idle" | "uploading" | "creating" | "success" | "redirecting">("idle");
  const [progress, setProgress] = useState(0);
  const [loadingTitle, setLoadingTitle] = useState("");

  // Transform initialData (from API) to FormValues
  const defaultValues = initialData ? {
      name: initialData.name,
      type: initialData.type || "simple",
      short_description: initialData.short_description || "",
      description: initialData.description || "",
      regular_price: initialData.regular_price || "",
      sale_price: initialData.sale_price || "",
      sku: initialData.sku || "",
      stock_status: initialData.stock_status || "instock",
      manage_stock: initialData.manage_stock ?? false,
      stock_quantity: initialData.stock_quantity ? String(initialData.stock_quantity) : "",
      requires_shipping: initialData.shipping_required ?? true,
      weight: initialData.weight || "",
      dimensions: initialData.dimensions || { length: "", width: "", height: "" },
      status: initialData.status || "publish",
      catalog_visibility: initialData.catalog_visibility || "visible",
      enable_reviews: initialData.reviews_allowed ?? true,
      categories: initialData.categories ? initialData.categories.map((c: any) => c.id) : [],
      
      // Images need special handling - we might need to populate them as Objects if we want to show preview
      // For now, if editing, we might need to assume existing images are handled differently 
      // OR we fetch them and convert to 'preview' format.
      // This is complex. For V1 of editing, we might just show them and if replaced, we allow.
      // NOTE: Our ImageUpload component expects {file, preview}. 
      // If we have existing images, we can mock the 'preview' URL.
      cover_image: initialData.images && initialData.images[0] ? {
          file: new File([], "existing.jpg"), // Dummy file
          preview: initialData.images[0].src,
          id: initialData.images[0].id // Store ID to avoid re-upload
      } : null,
      
      gallery_images: initialData.images && initialData.images.length > 1 ? initialData.images.slice(1).map((img: any) => ({
          file: new File([], "existing.jpg"),
          preview: img.src,
          id: img.id
      })) : [],

  } : {
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
  };

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues as any,
  });

  const { formState: { isSubmitting } } = methods;

  // Use useWatch instead of watch for better reactivity
  const productType = useWatch({ control: methods.control, name: "type" });
  const isVirtual = useWatch({ control: methods.control, name: "virtual" });

  async function uploadImage(imageFile: ImageFile): Promise<number> {
    // If image has an ID, it's already uploaded (from edit mode)
    if (imageFile.id) return imageFile.id;

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
    setLoadingState("uploading");
    setProgress(0);
    setLoadingTitle(isEditing ? "Updating assets..." : "Initializing upload...");

    try {
      const uploadedImageIds: number[] = [];
      let totalImagesToUpload = 0;

      // Calculate total work
      if (data.cover_image && !data.cover_image.id) totalImagesToUpload++;
      if (data.gallery_images) {
           totalImagesToUpload += data.gallery_images.filter(img => !img.id).length;
      }
      
      // If editing, we start with existing IDs
      if (data.cover_image && data.cover_image.id) uploadedImageIds.push(data.cover_image.id);
      
      // NOTE: We need to respect order. This logic is a bit simplified.
      // Correct logic: Process all in order. If has ID, push ID. If not, upload then push ID.
      // But we separated Cover vs Gallery.
      // WooCommerce expects `images: [ {id: 1}, {id: 2} ]`. 
      // The first one is cover.

      // Better Approach for Mixed Content (New + Existing)
      const finalImagePayload: { id: number }[] = [];
      
      // 1. Cover Image
      if (data.cover_image) {
          if (data.cover_image.id) {
              finalImagePayload.push({ id: data.cover_image.id });
          } else {
              setLoadingTitle(`Uploading cover image...`);
              const id = await uploadImage(data.cover_image);
              finalImagePayload.push({ id });
              // Simplified progress
              if (totalImagesToUpload > 0) setProgress(20); 
          }
      }

      // 2. Gallery Images
      if (data.gallery_images && data.gallery_images.length > 0) {
          let count = 0;
          const newGalleryImages = data.gallery_images.filter(img => !img.id);
          for (const img of data.gallery_images) {
              if (img.id) {
                  finalImagePayload.push({ id: img.id });
              } else {
                  setLoadingTitle(`Uploading gallery image ${count + 1}...`);
                  const id = await uploadImage(img);
                  finalImagePayload.push({ id });
                  count++;
                  // Update progress roughly
                  if (newGalleryImages.length > 0) {
                      const p = 20 + ((count / newGalleryImages.length) * 40);
                      setProgress(Math.min(p, 60));
                  }
              }
          }
      } else {
          // If no uploads, jump to 60 immediately
          setProgress(60);
      }

      // Step 2: Create/Update product
      setLoadingState("creating");
      setLoadingTitle(isEditing ? "Updating product details..." : "Validating product details...");
      setProgress(70);

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
         images: finalImagePayload,
         
         weight: data.weight,
         dimensions: data.dimensions,
         
         status: data.status,
         catalog_visibility: data.catalog_visibility,
         purchase_note: data.purchase_note,
         reviews_allowed: data.enable_reviews,
      };

      // Slight delay to show validating text
      await new Promise(r => setTimeout(r, 800));
      setProgress(85);
      setLoadingTitle(isEditing ? "Saving changes..." : "Creating product listing...");

      const endpoint = isEditing ? `/api/vendor/products/${initialData.id}` : "/api/vendor/products/create";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
         const errText = await res.text();
         throw new Error(errText);
      }

      setProgress(100);
      setLoadingState("success");
      
      // Artificial delay for success state
      await new Promise(r => setTimeout(r, 1000));
      
      setLoadingState("redirecting");
      router.push("/dashboard/products");
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to save product. Please try again.");
      setLoadingState("idle");
    }
  }

  const handleDelete = async () => {
      if (!isEditing || !initialData?.id) return;
      if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
      
      try {
          const res = await fetch(`/api/vendor/products/${initialData.id}`, {
              method: "DELETE"
          });
          if (!res.ok) throw new Error("Failed to delete");
          toast.success("Product deleted");
          router.push("/dashboard/products");
          router.refresh();
      } catch (e) {
          toast.error("Error deleting product");
      }
  };

  return (
    <FormProvider {...methods}>
        <ProductCreationLoader 
            stage={loadingState} 
            progress={progress} 
            title={loadingTitle} 
        />
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
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            {isEditing ? `Edit: ${initialData?.name || "Product"}` : "Add New Product"}
                        </h1>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            {isEditing ? "Update your product details and inventory." : "Fill in the details to create your listing."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    
                     {isEditing && (
                         <Button variant="destructive" size="icon" onClick={handleDelete} type="button">
                             <Trash2 className="h-4 w-4" />
                         </Button>
                     )}

                    <Button 
                        onClick={methods.handleSubmit(onSubmit)} 
                        disabled={loadingState !== "idle" || isSubmitting}
                        className="bg-[#6a00f3] hover:bg-[#5b00d1]"
                    >
                        {(loadingState !== "idle" || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Update Product" : "Save Product"}
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
                                                disabled={loadingState !== "idle"}
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
                                                disabled={loadingState !== "idle"}
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
