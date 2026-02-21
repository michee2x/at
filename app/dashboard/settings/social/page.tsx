import { getStoreSettings } from "@/lib/actions/dashboard/settings";
import { SocialSettingsForm } from "@/components/dashboard/settings/SocialSettingsForm";
import { ExternalLink } from "lucide-react";

export default async function SocialSettingsPage() {
    // Fetch data server-side
    const { success, social } = await getStoreSettings();
    const initialData = success && social ? social : {};

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Social Profiles 
                <ExternalLink className="h-5 w-5 text-primary cursor-pointer" />
            </h1>
            
            <p className="text-gray-500 mb-8 max-w-2xl text-sm leading-relaxed">
                Social profiles help you to gain more trust. Consider adding your social profile links for better user interaction.
            </p>

            <SocialSettingsForm initialData={initialData} />
        </div>
    );
}
