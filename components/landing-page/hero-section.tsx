import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextEffect } from "../motion-primitives/text-effect";
import { TextLoop } from "../motion-primitives/text-loop";
import GridBackground from "./GridBackground";
import { ArrowUpRight } from "lucide-react";
import StatsCard from "./stats-card";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-dvh overflow-hidden mt-0 md:mt-15 py-20 sm:py-28">
      <GridBackground />
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <Badge
            variant="secondary"
            trail
            className="px-3 py-1 tracking-tight text-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            Join thousands of creators launching in public
          </Badge>
        </div>

        {/* Heading */}
        <TextEffect
          className="text-5xl font-semibold tracking-tighter sm:text-5xl md:text-6xl"
          preset="fade-in-blur"
          speedReveal={1.1}
          speedSegment={0.3}
        >
          Share what you’ve built. Discover what’s launching next.
        </TextEffect>

        {/* Description */}
        <div className="mx-auto mt-6 font-light max-w-2xl text-sm tracking-tight text-muted-foreground sm:text-base">
          A community-driven platform where creators showcase{" "}
          <TextLoop
            className="overflow-y-clip text-white font-medium italic"
            transition={{
              type: "spring",
              stiffness: 900,
              damping: 80,
              mass: 10,
            }}
            variants={{
              initial: {
                y: 20,
                rotateX: 90,
                opacity: 0,
                filter: "blur(4px)",
              },
              animate: {
                y: 0,
                rotateX: 0,
                opacity: 1,
                filter: "blur(0px)",
              },
              exit: {
                y: -20,
                rotateX: -90,
                opacity: 0,
                filter: "blur(4px)",
              },
            }}
          >
            <span className="text-orange-500 underline decoration-1 underline-offset-4">
              apps
            </span>
            <span className="text-blue-500 underline decoration-1 underline-offset-4">
              AI tools
            </span>
            <span className="text-red-500 underline decoration-1 underline-offset-4">
              SaaS products
            </span>
            <span className="text-yellow-500 underline decoration-1 underline-offset-4">
              creative projects
            </span>
          </TextLoop>{" "}
          Launch authentically, get real feedback, and grow with people who
          actually build.
        </div>

        {/* Actions */}
        <div className="mt-10 flex tracking-tight flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="rounded-full" variant="ghost" size="lg">
            <Link href={"/submit"}>Share your project</Link>
          </Button>
          <Button className="rounded-full" size="lg">
            <Link href={"/explore"}>Explore projects</Link>
            <ArrowUpRight strokeWidth={2} />
          </Button>
        </div>
      </div>
      <StatsCard />
    </section>
  );
};

export default Hero;
