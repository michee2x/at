"use client";

import { useState } from "react";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardSidebar from "./sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/auth-context";
import { CartSheet } from "@/components/cart/CartSheet";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { session } = useAuth();

  const userName =
    (session?.user && ("name" in session.user ? session.user.name : null)) ||
    session?.user?.email?.split("@")[0] ||
    "Account";
  const userEmail = session?.user?.email || " ";
  const userImage =
    (session?.user && ("image" in session.user ? session.user.image : null)) ||
    null;

  return (
    <header className="sticky px-4 flex items-center justify-between top-0 z-50 w-full border-b bg-white">
      <div className="flex gap-2 h-16 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="badge-ghost bg-gray-100 text-black"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <DashboardSidebar onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="/"
          className="w-fit flex items-center gap-0.5"
        >
          <div className="relative size-8">
            <Image
              className="object-cover"
              fill
              alt="atlaze-logo"
              src="/logo/Untitled_design_20251108_095010_0000__1_-removebg-preview.png"
            />
          </div>
          <h1 className="h-full aspect-square font-display text-2xl italic text-[#2B2B2B] flex items-center justify-center">
            atlaze
          </h1>
        </Link>
      </div>
      <nav
        className="gap-x-2 flex items-center py-4"
        role="navigation"
        aria-label="Dashboard navigation"
      >
        {/* User Order button / Cart Sheet */}
        <CartSheet />

        {/* User profile menu - uses logged-in user data */}
        {session?.user && (
          <UserMenu name={userName || ""} email={userEmail} image={userImage} />
        )}
      </nav>
    </header>
  );
}
