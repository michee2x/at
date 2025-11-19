import Footer from "@/components/desktop-footer";
import MobileFooter from "@/components/mobile-footer";
import { FloatingNav } from "@/components/ui/floating-navbar";
import SidebarWrapper from "@/components/SidebarWrapper";
import Providers from "../Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main data-theme="light" className="w-full min-h-screen relative">
      <SidebarWrapper /> {/* CLIENT ONLY, SAFE */}
      <FloatingNav />
      {children}
      <Footer />
      <MobileFooter />
    </main>
  );
}
