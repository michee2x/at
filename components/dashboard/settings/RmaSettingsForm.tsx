"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateStoreRmaSettings, WarrantySettings } from "@/lib/actions/dashboard/settings";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";

interface RmaSettingsFormProps {
    initialData: WarrantySettings;
}

export function RmaSettingsForm({ initialData }: RmaSettingsFormProps) {
    const [formData, setFormData] = useState<WarrantySettings>({
        label: initialData.label || "Warranty",
        type: initialData.type || "no_warranty",
        policy: initialData.policy || ""
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: keyof WarrantySettings, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const res = await updateStoreRmaSettings(formData);
            if (res.success) {
                toast.success("RMA settings updated successfully!");
                // Optionally update local state with result if backend transforms it
            } else {
                toast.error(res.message || "Failed to update settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white p-0 max-w-3xl space-y-8">
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-center">
                    <div className="flex items-center justify-end gap-2">
                        <Label className="text-right font-bold text-gray-700">Label:</Label>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input 
                        value={formData.label} 
                        onChange={(e) => handleChange("label", e.target.value)}
                        placeholder="Warranty"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-center">
                    <div className="flex items-center justify-end gap-2">
                        <Label className="text-right font-bold text-gray-700">Type:</Label>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <Select 
                        value={formData.type} 
                        onValueChange={(value: any) => handleChange("type", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Warranty Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no_warranty">No Warranty</SelectItem>
                            <SelectItem value="included_warranty">Warranty Included</SelectItem>
                            <SelectItem value="addon_warranty">Warranty as Add-On</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Label className="text-right font-bold text-gray-700">RMA Policy:</Label>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="w-full">
                        {/* Placeholder for Rich Text Editor - using Textarea for now */}
                        <div className="border rounded-md">
                            {/* Toolbar Placeholder */}
                            <div className="flex items-center gap-1 border-b p-2 bg-gray-50 text-gray-500">
                                <span className="font-bold px-2 cursor-pointer hover:text-gray-800">B</span>
                                <span className="italic px-2 cursor-pointer hover:text-gray-800">I</span>
                                <span className="underline px-2 cursor-pointer hover:text-gray-800">U</span>
                            </div>
                            <Textarea 
                                className="border-0 rounded-none min-h-[150px] focus-visible:ring-0"
                                value={formData.policy}
                                onChange={(e) => handleChange("policy", e.target.value)}
                                placeholder="Enter your RMA policy here..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button 
                    onClick={handleSubmit} 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
