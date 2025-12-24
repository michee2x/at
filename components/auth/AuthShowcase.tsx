import Image from "next/image";
import { Globe, ShieldCheck } from "lucide-react";

interface AuthShowcaseProps {
  step?: string;
}

export default function AuthShowcase({ step }: AuthShowcaseProps) {
  return (
    <div className={`relative w-full h-[35vh] lg:h-auto lg:flex-1 shrink-0 bg-slate-900 flex flex-col overflow-hidden ${step === "email" ? "hidden lg:flex" : "flex"}`}>
      <Image
        src="/auth/african_wildlife.png"
        className="object-cover lg:object-center object-[center_bottom] lg:scale-100 scale-110"
        fill
        alt="African wildlife illustration"
        priority
      />
      
      {/* Enhanced gradient overlays for depth */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 z-0" />
      
      {/* Brand Logo with frosted background */}
      <div className="relative z-10 flex items-center gap-2 p-4 lg:p-12">
        <div className="w-8 h-8 relative bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <Image
            src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
            alt="Atlaze"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-bold text-xl text-white tracking-tight drop-shadow-lg">atlaze</span>
      </div>

      {/* Text Content */}
      <div className="relative z-10 max-w-lg mt-auto p-4 lg:p-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 hidden lg:block drop-shadow-lg leading-tight">
          Discover Authentic <br />
          <span className="text-amber-400">African Products.</span>
        </h2>
        <p className="text-gray-100 -mt-16 lg:-mt-0 text-sm lg:text-base leading-relaxed max-w-sm drop-shadow-md">
          Shop unique handcrafted goods from local makers.
        </p>
      </div>
    </div>
  );
}
