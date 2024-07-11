"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  User,
  Settings,
  LogOut,
  Telescope,
  Heart,
  ImageIcon,
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

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
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
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => signOut()}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-300 hover:text-white flex flex-col items-center">
                <Settings className="w-6 h-6" />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={() => signOut()}
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
