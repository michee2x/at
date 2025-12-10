import Footer from "@/components/desktop-footer";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Suspense } from "react";
import Providers from "../Providers";
import ClientUIWrapper from "@/components/ClientUIWrapper";
import MobileFooter from "@/components/mobile-footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main data-theme="light" className="w-full min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <SidebarWrapper /> {/* CLIENT ONLY, SAFE */}
      </Suspense>
      <Suspense fallback={null}>
        <ClientUIWrapper />
      </Suspense>
      <div className="flex-1">{children}</div>
      <Suspense fallback={null}>
        <MobileFooter />
      </Suspense>
      <Footer />
    </main>
  );
}
