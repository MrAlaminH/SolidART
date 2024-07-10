"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/api/auth/signin");
  }, [session, status, router]);

  if (status === "loading") {
    return <div> </div>;
  }

  if (!session) {
    return <div></div>;
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md">
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
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

          <div className="hidden md:flex items-center space-x-4">
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
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/explore"
              className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Telescope className="w-5 h-5 mr-2" /> Explore
            </Link>
            <Link
              href="/loved"
              className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Heart className="w-5 h-5 mr-2" /> Loved
            </Link>
            <Link
              href="/generate"
              className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <ImageIcon className="w-5 h-5 mr-2" /> Generate
            </Link>
            {/* <div className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center">
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
            </div> */}
            <Link
              href="/settings"
              className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" /> Settings
            </Link>
            <button
              onClick={() => signOut()}
              className="text-gray-300 hover:bg-gray-700 hover:text-white  px-3 py-2 rounded-md text-base font-medium flex items-center w-full"
            >
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
