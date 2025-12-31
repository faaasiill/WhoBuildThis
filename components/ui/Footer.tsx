"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../app/WHO.svg";

const SHOW_OFFSET = 120;
const HIDE_OFFSET = 350;

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const scrollBottom = window.scrollY + window.innerHeight;
                const pageHeight = document.documentElement.scrollHeight;

                if (scrollBottom >= pageHeight - SHOW_OFFSET) {
                    setIsVisible(true);
                }

                if (scrollBottom < pageHeight - HIDE_OFFSET) {
                    setIsVisible(false);
                }

                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <footer
            style={{
                background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 40%)",
            }}
            className={`
                fixed bottom-0 left-0 right-0 z-40 mx-auto w-[95%]
                border-2 border-white/10 rounded-full backdrop-blur-md
                will-change-transform will-change-opacity
                transition-all duration-1000
                ease-[cubic-bezier(0.12,1,0.25,1)]
                ${
                    isVisible
                        ? "-translate-y-2 opacity-100"
                        : "translate-y-[120%] opacity-0"
                }
            `}
        >
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                    <Image src={logo} alt="Logo" className="w-40 h-auto" />

                    <p className="text-sm tracking-tighter text-center md:text-right bg-gradient-to-br from-white/90 via-white/60 to-white/30 bg-clip-text text-transparent">
                        © {year ?? "—"} All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
