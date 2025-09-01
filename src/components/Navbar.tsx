"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { User } from "lucide-react";
import Image from "next/image";
import { isValidImageSrc } from "@/utils/isValidImageSrc";

const navLinks = [{ href: "/", label: "Home" }];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Sunrise PG Services logo"
                width={72}
                height={72}
                priority
                className="h-28 w-28 object-contain"
              />
            </Link>
          </div>

          {/* Navigation - Both Desktop and Mobile */}
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/50 dark:bg-orange-900/20"
                    : "text-gray-700 hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication Buttons */}
            <div className="ml-1 md:ml-2 flex space-x-1">
              {isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link
                    href={
                      user?.role === "admin"
                        ? "/admin"
                        : user?.role === "manager"
                          ? "/manager"
                          : "/dashboard"
                    }
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors bg-orange-50/50 dark:bg-orange-900/20 hover:bg-orange-100/80 dark:hover:bg-orange-800/30"
                  >
                    <div className="relative">
                      <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center overflow-hidden border-2 border-orange-200 dark:border-orange-700">
                        {isValidImageSrc(user?.profileImage) ? (
                          <Image
                            src={user.profileImage}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            width={32}
                            height={32}
                          />
                        ) : (
                          <User className="h-3 w-3 md:h-4 md:w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-1 md:px-2 py-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-md text-xs md:text-sm font-medium"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                      pathname === "/login"
                        ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/50 dark:bg-orange-900/20"
                        : "text-gray-700 hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-2 md:px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs md:text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
