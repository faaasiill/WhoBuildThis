"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../app/WHO.svg";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
} from "@clerk/nextjs";
import Link from "next/link";
import CustomUserButton from "../common/custom-user-buttom";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsMobileMenuOpen(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 rounded-b-4xl backdrop-blur-md transition-transform duration-300 ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Image src={logo} alt="Logo" width={40} height={40} />

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-sm text-white hover:text-white/50"
                        >
                            Home
                        </Link>
                        <Link
                            href="/explore"
                            className="text-sm text-white hover:text-white/50"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/submit"
                            className="text-sm text-white hover:text-white/50"
                        >
                            Submit Project
                        </Link>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <SignedOut>
                            <SignInButton>
                                <button className="text-sm text-white hover:text-white/50">
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton>
                                <button className="text-sm px-4 py-2 bg-white text-black rounded-full hover:bg-white/70">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>

                        <SignedIn>
                            <CustomUserButton/>
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center"
                    >
                        <div className="w-6 h-5 relative flex items-center justify-center">
                            <span
                                className={`absolute left-0 bg-white h-[1.2px] w-full transition-all duration-300 ${
                                    isMobileMenuOpen
                                        ? "rotate-45"
                                        : "-translate-y-2"
                                }`}
                            />
                            <span
                                className={`absolute left-0 bg-white h-[1.2px] w-full transition-all duration-300 ${
                                    isMobileMenuOpen
                                        ? "opacity-0"
                                        : "opacity-100"
                                }`}
                            />
                            <span
                                className={`absolute left-0 bg-white h-[1.2px] w-full transition-all duration-300 ${
                                    isMobileMenuOpen
                                        ? "-rotate-45"
                                        : "translate-y-2"
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 pt-4 pb-6 space-y-3 bg-black/80 backdrop-blur-md border-t border-white/10">
                    {/* Links */}
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm tracking-tight text-white hover:text-white/60 transition"
                    >
                        Home
                    </Link>
                    <Link
                        href="/explore"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm tracking-tight text-white hover:text-white/60 transition"
                    >
                        Explore
                    </Link>
                    <Link
                        href="/submit"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm tracking-tight text-white hover:text-white/60 transition"
                    >
                        Submit Project
                    </Link>

                    {/* Auth */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                        <SignedOut>
                            <SignInButton>
                                <button className="w-full text-center text-sm text-white hover:text-white/60 transition">
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton>
                                <button className="w-full text-sm py-2 mb-4 bg-white text-black rounded-full hover:bg-white/80 transition">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>

                        <SignedIn>
                            <CustomUserButton/>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;