"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically load CreditScale with a fallback skeleton while loading
const CreditScale = dynamic(() => import("./Credit-scale"), {
  ssr: false,
  loading: () => (
    <div className="w-64 p-4 bg-black text-white">
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-2 w-full mb-4 rounded-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  ),
});

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

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
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

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/explore"
                className="text-white font-bold text-xl flex items-center"
              >
                SolidART.
              </Link>
            </div>
            <div className="flex items-center justify-center flex-grow">
              <div className="flex space-x-4">
                <Link
                  href="/explore"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Telescope className="w-5 h-5 mr-2" /> Explore
                </Link>
                <Link
                  href="/loved"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Heart className="w-5 h-5 mr-2" /> Loved
                </Link>
                <Link
                  href="/generate"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <ImageIcon className="w-5 h-5 mr-2" /> Generate
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Zap className="w-5 h-5 mr-2" /> Update Plan
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="User"
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                    ) : (
                      <User className="w-5 h-5 mr-2" />
                    )}
                    {session.user?.name || "My Profile"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* Render CreditScale with cached data */}
                  <CreditScale />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left"
                    >
                      <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/explore"
            className="text-gray-300 hover:text-white flex flex-col items-center"
          >
            <Telescope className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Link>
          <Link
            href="/loved"
            className="text-gray-300 hover:text-white flex flex-col items-center"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Loved</span>
          </Link>
          <Link
            href="/generate"
            className="text-gray-300 hover:text-white flex flex-col items-center"
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Generate</span>
          </Link>
          <Link
            href="/pricing"
            className="text-gray-300 hover:text-white flex flex-col items-center"
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs mt-1">Update Plan</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-300 hover:text-white flex flex-col items-center">
                <Settings className="w-6 h-6" />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Render CreditScale in mobile nav */}
              <CreditScale />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
