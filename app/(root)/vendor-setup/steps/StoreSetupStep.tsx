import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface StoreSetupStepProps {
  onNext: () => void;
}

export default function StoreSetupStep({ onNext }: StoreSetupStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to save store info
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Store Setup</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="street" className="md:text-right text-gray-700 font-semibold text-sm">
            Street <span className="text-orange-500">*</span>
          </Label>
          <div className="md:col-span-3">
            <Input id="street" required className="bg-blue-50/50 border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="street2" className="md:text-right text-gray-700 font-semibold text-sm">
            Street 2
          </Label>
          <div className="md:col-span-3">
            <Input id="street2" className="border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="city" className="md:text-right text-gray-700 font-semibold text-sm">
            City <span className="text-orange-500">*</span>
          </Label>
          <div className="md:col-span-3">
            <Input id="city" required className="bg-blue-50/50 border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="zip" className="md:text-right text-gray-700 font-semibold text-sm">
            Post/Zip Code <span className="text-orange-500">*</span>
          </Label>
          <div className="md:col-span-3">
            <Input id="zip" required className="bg-blue-50/50 border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="country" className="md:text-right text-gray-700 font-semibold text-sm">
            Country <span className="text-orange-500">*</span>
          </Label>
          <div className="md:col-span-3">
            <Select required>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="- Select a location -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="GH">Ghana</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Label htmlFor="state" className="md:text-right text-gray-700 font-semibold text-sm">
            State <span className="text-orange-500">*</span>
          </Label>
          <div className="md:col-span-3">
            <Select required>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="State Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABJ">Abuja</SelectItem>
                <SelectItem value="LAG">Lagos</SelectItem>
                <SelectItem value="KAS">Kano</SelectItem>
                <SelectItem value="RIV">Rivers</SelectItem>
                <SelectItem value="BY">Bayelsa</SelectItem>
                <SelectItem value="ENU">Enugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-6 md:pl-[25%]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-8 rounded-md transition-colors w-full sm:w-auto flex justify-center items-center h-11 min-w-[140px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
