import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header-3";
import Footer from "@/components/ui/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "WhoBuildThis",
    description:
        "WhoBuildThis is a platform for building and sharing your own project with the World!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.variable} antialiased`}>
                    <Header />
                    <main className="pt-10 md:pt-0">{children}</main>
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}
