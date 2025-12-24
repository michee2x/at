"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User as UserIcon, ShoppingBag } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
  onLogout?: () => void;
}

export function UserMenu({ name, email, image, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 aspect-square rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-4">
        <div className="flex items-center gap-3">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>



        <DropdownMenuSeparator className="my-3" />

        <DropdownMenuItem asChild className="lg:hidden cursor-pointer">
          <Link href="/categories" target="_blank" rel="noopener noreferrer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-3 lg:hidden" />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onSelect={(e) => {
            e.preventDefault();
            onLogout?.();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
