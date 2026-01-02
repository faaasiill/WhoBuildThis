import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import VoteConter from "../ui/vote-control";

const FeaturedCard = ({ featuredProjects }: { featuredProjects: any[] }) => {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                    {featuredProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <div className="relative group h-[320px] overflow-hidden border hover:border-zinc-700 hover:z-10 transition-all cursor-pointer">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-x-0 bottom-0 h-50 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                                <Link
                                    href={`/products/${project.slug}`}
                                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition group-hover:scale-110"
                                >
                                    <ArrowUpRight className="w-4 h-4 text-white" />
                                </Link>

                                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                                    <div className="flex items-end justify-between gap-4">
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-semibold text-white tracking-tighter truncate">
                                                {project.title}
                                            </h2>
                                            <p className="text-zinc-300 text-xs tracking-tighter line-clamp-1">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {project.tags.map(
                                                    (
                                                        tag: string,
                                                        index: number
                                                    ) => (
                                                        <span
                                                            key={tag}
                                                            className="px-3 py-1 tracking-tighter rounded-full bg-black/40 border border-white/10 text-white text-xs backdrop-blur-md transition-all duration-300 group-hover:translate-y-0"
                                                            style={{
                                                                transitionDelay: `${
                                                                    index * 50
                                                                }ms`,
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <VoteConter
                                            vote={project.vote}
                                            projectId={project.id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedCard;
