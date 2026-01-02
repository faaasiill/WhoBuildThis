"use cache";

import {
    getFeturedProducts,
    getProductBySlug,
} from "@/lib/products/product-select";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Calendar, User, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import InlineVote from "@/components/ui/InlineVote";

export const generateStaticParams = async () => {
    const products = await getFeturedProducts();

    return products.map((product) => ({
        slug: product.slug,
    }));
};

export default async function Product({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen mb-80 bg-black mt-0 sm:mt-16 text-white">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image */}
                    <div className="space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden border border-zinc-800">
                            <Image
                                src={product.webImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Visit Website Button */}
                        <a
                            href={product.webURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-black text-sm tracking-tight font-medium hover:bg-zinc-200 transition-colors"
                        >
                            Visit Website
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tighter">
                                {product.name}
                            </h1>
                            <p className=" text-zinc-500 tracking-tight">
                                {product.tagline}
                            </p>
                        </div>

                        {/* Vote Count */}
                        <div
                            className="inline-flex items-center gap-4 px-6 py-3 border border-zinc-800 rounded-full
  shadow-[inset_2px_2px_6px_rgba(255,255,255,0.20)]"
                        >
                            <InlineVote
                                initialVote={product.voteCount}
                                productId={product.id}
                            />

                            <span className="text-sm tracking-tight font-medium text-zinc-400">
                                votes
                            </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h2 className="text-sm tracking-tight uppercase text-zinc-500 font-medium">
                                Description
                            </h2>
                            <p className="text-sm tracking-tighter leading-relaxed text-zinc-300">
                                {product.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-sm tracking-tight uppercase text-zinc-500 font-medium">
                                    Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 rounded-full py-1 text-xs tracking-tight border border-zinc-800 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.15)] text-zinc-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="space-y-3 pt-6 border-t border-zinc-800">
                            <h2 className="text-sm tracking-tight uppercase text-zinc-500 font-medium">
                                Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-xs tracking-tight text-zinc-500">
                                            Submitted by
                                        </p>
                                        <p className="text-sm tracking-tight text-zinc-300">
                                            {product.submittedBy}
                                        </p>
                                    </div>
                                </div>

                                {product.organizationId && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-xs tracking-tight text-zinc-500">
                                                Organization
                                            </p>
                                            <p className="text-sm tracking-tight text-zinc-300">
                                                {product.organizationId}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-xs tracking-tight text-zinc-500">
                                            Submitted
                                        </p>
                                        <p className="text-sm tracking-tight text-zinc-300">
                                            {formatDistanceToNow(
                                                new Date(product.createdAt),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}