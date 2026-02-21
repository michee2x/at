import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReadyStep() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
      </div>
      
      <h2 className="text-3xl font-semibold text-gray-800 mb-10">Your Store is Ready!</h2>
      
      <div className="space-y-4 w-full max-w-sm">
        <Link
          href="/dashboard"
          className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Go to your Store Dashboard!
        </Link>
      </div>

      <div className="mt-8">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium"
        >
          Return to the Marketplace
        </Link>
      </div>
    </div>
  );
}
