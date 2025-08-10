"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../hooks/useAuth";
import {
  MenuIcon,
  XIcon,
  Home,
  Building,
  GalleryHorizontal,
  MessageSquareText,
  HelpCircle,
  Contact,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              <div className="bg-gradient-to-r from-orange-400 to-yellow-500 h-10 w-10 rounded-full flex items-center justify-center mr-2 shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Sunrise<span className="text-orange-500">PG</span>
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname === link.href
                    ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/50 dark:bg-orange-900/20"
                    : "text-gray-700 hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                }`}
              >
                <span className="opacity-70">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Authentication Buttons */}
            <div className="ml-2 flex space-x-1">
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
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-orange-50/50 dark:bg-orange-900/20 hover:bg-orange-100/80 dark:hover:bg-orange-800/30"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center overflow-hidden border-2 border-orange-200 dark:border-orange-700">
                        {user?.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            width={32}
                            height={32}
                          />
                        ) : (
                          <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-md"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      pathname === "/login"
                        ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/50 dark:bg-orange-900/20"
                        : "text-gray-700 hover:text-orange-600 dark:text-gray-200 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                    }`}
                  >
                    <LogIn className="w-4 h-4 opacity-70" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 ${
                  pathname === link.href
                    ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="opacity-70">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Login and Registration in Mobile Menu */}
            <div className="border-t dark:border-gray-800 pt-2 mt-2 grid grid-cols-3 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={
                      user?.role === "admin"
                        ? "/admin"
                        : user?.role === "manager"
                          ? "/manager"
                          : "/dashboard"
                    }
                    className="col-span-2 px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center overflow-hidden">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <User className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    {user?.name?.split(" ")[0] || "Dashboard"}
                  </Link>
                  <button
                    onClick={(e) => {
                      handleLogout(e);
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-md text-base font-medium border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                      pathname === "/login"
                        ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 opacity-70" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-base font-medium transition-colors flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
