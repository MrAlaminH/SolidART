"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Settings,
  LogOut,
  Telescope,
  Heart,
  ImageIcon,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreditScale = dynamic(() => import("./Credit-scale"), {
  ssr: false,
  loading: () => (
    <div className="w-64 p-4 bg-background text-foreground">
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-2 w-full mb-4 rounded-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  ),
});

const navItems = [
  { href: "/explore", icon: Telescope, label: "Explore" },
  { href: "/loved", icon: Heart, label: "Loved" },
  { href: "/generate", icon: ImageIcon, label: "Generate" },
  { href: "/pricing", icon: Zap, label: "Update Plan" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/api/auth/signin");
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user?.image || undefined}
              alt={session.user?.name ?? ""}
            />
            <AvatarFallback>{session.user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CreditScale />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/explore"
                className="text-foreground font-bold text-xl flex items-center"
              >
                SolidART.
              </Link>
            </div>
            <div className="flex items-center justify-center flex-grow">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border md:hidden z-50 h-16 flex items-center justify-between px-4">
        <Link
          href="/explore"
          className="text-foreground font-bold text-xl flex items-center"
        >
          SolidART.
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserMenu />
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex flex-col items-center py-2"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
