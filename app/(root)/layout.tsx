import Footer from "@/components/desktop-footer";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Suspense } from "react";
import Providers from "../Providers";
import ClientUIWrapper from "@/components/ClientUIWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main data-theme="light" className="w-full min-h-screen relative">
      <Suspense fallback={null}>
        <SidebarWrapper /> {/* CLIENT ONLY, SAFE */}
      </Suspense>
      <Suspense fallback={null}>
        <ClientUIWrapper />
      </Suspense>
      {children}
      <Footer />
    </main>
  );
}
