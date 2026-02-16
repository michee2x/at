"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Search, Facebook, Twitter, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { storeSeoSchema, type StoreSeoFormValues } from "@/lib/schemas/store-seo";
import { updateStoreSeoSettings } from "@/lib/actions/dashboard/seo";
import { MediaUpload } from "@/components/dashboard/MediaUpload";

interface StoreSEOSectionProps {
  initialData: Partial<StoreSeoFormValues>;
}

export function StoreSEOSection({ initialData }: StoreSEOSectionProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<StoreSeoFormValues>({
    resolver: zodResolver(storeSeoSchema),
    defaultValues: initialData,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  // Watch image URLs for preview
  const ogImageUrl = watch("ogImage");
  const twitterImageUrl = watch("twitterImage");

  async function onSubmit(data: StoreSeoFormValues) {
    setIsSaving(true);
    try {
      const result = await updateStoreSeoSettings(data);
      
      if (result.success) {
        toast.success("SEO settings saved successfully");
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Store SEO</h1>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
        </TabsList>

        {/* General SEO */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-violet-600" />
                Meta Information
              </CardTitle>
              <CardDescription>
                Control how your store appears in search engine results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">SEO Title</Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  placeholder="My Awesome Store"
                />
                {errors.metaTitle && (
                  <p className="text-sm text-red-500">{errors.metaTitle.message}</p>
                )}
                <p className="text-xs text-gray-500">The title tag affects your ranking in search engines.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  {...register("metaDesc")}
                  placeholder="Shop the best products..."
                  rows={4}
                />
                {errors.metaDesc && (
                  <p className="text-sm text-red-500">{errors.metaDesc.message}</p>
                )}
                <p className="text-xs text-gray-500">A brief summary of your store shown in search results.</p>
              </div>

               <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register("metaKeywords")}
                  placeholder="fashion, electronics, handmade"
                />
                {errors.metaKeywords && (
                  <p className="text-sm text-red-500">{errors.metaKeywords.message}</p>
                )}
                <p className="text-xs text-gray-500">Comma-separated keywords relevant to your store.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facebook / Open Graph */}
        <TabsContent value="facebook" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook / Open Graph
              </CardTitle>
              <CardDescription>
                Customize how your store looks when shared on Facebook and other social platforms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ogTitle">Facebook Title</Label>
                <Input
                  id="ogTitle"
                  {...register("ogTitle")}
                  placeholder="My Store on Facebook"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDesc">Facebook Description</Label>
                <Textarea
                  id="ogDesc"
                  {...register("ogDesc")}
                  placeholder="Check out our latest collection..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Facebook Image</Label>
                <MediaUpload
                  key={ogImageUrl}
                  value={ogImageUrl || ""}
                  onChange={(url, id) => {
                    setValue("ogImage", url);
                    setValue("ogImageId", id, { shouldDirty: true });
                  }}
                  label="Upload OG Image"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Image to be displayed when shared on Facebook.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Twitter */}
        <TabsContent value="twitter" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-sky-400" />
                Twitter Card
              </CardTitle>
              <CardDescription>
                Customize how your store looks when shared on Twitter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="twitterTitle">Twitter Title</Label>
                <Input
                  id="twitterTitle"
                  {...register("twitterTitle")}
                  placeholder="My Store on Twitter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterDesc">Twitter Description</Label>
                <Textarea
                  id="twitterDesc"
                  {...register("twitterDesc")}
                  placeholder="Follow us for updates..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                 <Label>Twitter Image</Label>
                <MediaUpload
                  key={twitterImageUrl}
                  value={twitterImageUrl || ""}
                  onChange={(url, id) => {
                    setValue("twitterImage", url);
                    setValue("twitterImageId", id, { shouldDirty: true });
                  }}
                  label="Upload Twitter Image"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Image to be displayed when shared on Twitter.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
