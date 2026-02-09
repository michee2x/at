"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSocialSettings, SocialLinks } from "@/lib/actions/dashboard/settings";
import { Facebook, Twitter, Linkedin, Youtube, Instagram, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Validation helpers
const validators: Record<string, { regex: RegExp; message: string }> = {
    fb: { regex: /facebook\.com/, message: "Invalid Facebook URL. Example: https://www.facebook.com/yourprofile" },
    twitter: { regex: /(twitter\.com|x\.com)/, message: "Invalid Twitter URL. Example: https://twitter.com/yourprofile" },
    pinterest: { regex: /pinterest\.com/, message: "Invalid Pinterest URL. Example: https://www.pinterest.com/yourprofile" },
    linkedin: { regex: /linkedin\.com/, message: "Invalid LinkedIn URL. Example: https://www.linkedin.com/in/yourprofile" },
    youtube: { regex: /youtube\.com/, message: "Invalid YouTube URL. Example: https://www.youtube.com/channel/yourchannel" },
    tiktok: { regex: /tiktok\.com/, message: "Invalid TikTok URL. Example: https://www.tiktok.com/@yourprofile" },
    instagram: { regex: /instagram\.com/, message: "Invalid Instagram URL. Example: https://www.instagram.com/yourprofile" },
    flickr: { regex: /flickr\.com/, message: "Invalid Flickr URL. Example: https://www.flickr.com/people/yourprofile" },
    threads: { regex: /threads\.net/, message: "Invalid Threads URL. Example: https://threads.net/@yourprofile" },
};

interface SocialSettingsFormProps {
    initialData: SocialLinks;
}

export function SocialSettingsForm({ initialData }: SocialSettingsFormProps) {
    const [formData, setFormData] = useState<SocialLinks>(initialData || {});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        
        // Clear error when user types, or validate immediately? 
        // Better to validate on change or blur. Let's validate on change for immediate feedback if strict, 
        // but user might be typing. Let's clear error on change.
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        Object.entries(formData).forEach(([key, value]) => {
            if (value && validators[key]) { // Only validate if value is present
                if (!validators[key].regex.test(value)) {
                    newErrors[key] = validators[key].message;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSaving(true);
        try {
            const res = await updateSocialSettings(formData);
            if (res.success) {
                toast.success("Social settings updated successfully!");
            } else {
                toast.error(res.message || "Failed to update settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const renderInput = (key: keyof SocialLinks, label: string, Icon?: any) => (
        <div key={key} className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 items-start pb-6">
            <label className="text-right font-bold pt-2 md:text-sm text-gray-800">{label}</label>
            <div className="w-full">
                <div className="relative flex items-center">
                    <div className="bg-gray-200 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 h-10 flex items-center justify-center text-gray-500">
                        {Icon ? <Icon className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    </div>
                    <Input 
                        value={formData[key] || ""} 
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`https://www.${key === 'twitter' ? 'twitter' : key}.com/yourprofile`}
                        className={`rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 ${errors[key] ? "border-red-500 bg-red-50" : ""}`}
                    />
                </div>
                {errors[key] && (
                    <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors[key]}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-white border rounded-none p-8 max-w-3xl">
            <div className="space-y-1">
                {renderInput("fb", "Facebook", Facebook)}
                {renderInput("twitter", "X", Twitter)}
                {renderInput("pinterest", "Pinterest")}
                {renderInput("linkedin", "LinkedIn", Linkedin)}
                {renderInput("youtube", "Youtube", Youtube)}
                {renderInput("tiktok", "TikTok")}
                {renderInput("instagram", "Instagram", Instagram)}
                {renderInput("flickr", "Flickr")}
                {renderInput("threads", "Threads")}
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                    onClick={handleSubmit} 
                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Update Settings"}
                </Button>
            </div>
        </div>
    );
}
