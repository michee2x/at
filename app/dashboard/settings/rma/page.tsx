import { getStoreSettings } from "@/lib/actions/dashboard/settings";
import { RmaSettingsForm } from "@/components/dashboard/settings/RmaSettingsForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function RmaSettingsPage() {
    const { success, warranties } = await getStoreSettings();
    const initialData = (success && warranties) ? warranties : {};

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-normal text-gray-800 flex items-center gap-2 mb-1">
                    Return and <br/> Warranty <ArrowRight className="h-6 w-6 text-gray-400" />
                </h1>
                <Link href="#" className="text-purple-600 text-xl font-normal hover:underline">
                    Visit Store
                </Link>
            </div>
            
            <div className="border-t pt-6">
                <p className="text-gray-500 italic mb-8 max-w-2xl text-sm font-light">
                    Set your settings for return and warranty your products. This settings will effect globally for your products
                </p>

                <RmaSettingsForm initialData={initialData} />
            </div>
        </div>
    );
}
