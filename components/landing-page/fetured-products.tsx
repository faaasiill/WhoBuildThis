"use client";

import { useEffect, useState } from "react";
import SectionHeader from "../common/section-header";
import FeaturedCard from "./fetured-card";

const FeturedProducts = ({ featuredProjects }: { featuredProjects: any[] }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const limit = window.innerHeight * 2;
            setIsSticky(scrollY <= limit);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDesktop]);

    return (
        <section
            className={`
                z-10 bg-black min-h-screen
                ${isDesktop && isSticky ? "sticky top-0" : "relative"}
            `}
        >
            <SectionHeader
                title="Fetured Today"
                subtitle="Top picks from our community this week"
            />

            <FeaturedCard featuredProjects={featuredProjects} />
        </section>
    );
};

export default FeturedProducts;
