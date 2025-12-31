"use client";

import * as React from "react";
import logo from "../../app/WHO.svg";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

export interface MagicTextProps {
    text: string;
}

interface WordProps {
    children: string;
    progress: any;
    range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);

    return (
        <span className="relative mt-[12px] mr-1">
            <span className="absolute opacity-20">{children}</span>
            <motion.span style={{ opacity: opacity }}>{children}</motion.span>
        </span>
    );
};

export const MagicText: React.FC<MagicTextProps> = ({ text }) => {
    const container = useRef(null);

    const { scrollYProgress } = useScroll({
        target: container,

        offset: ["start 0.9", "start 0.25"],
    });
    text;
    const words = text.split(" ");

    return (
        <div className="flex flex-col items-center gap-6">
            <Image className="w-52 -mt-20" src={logo} alt="Logo" />

            <h4
                ref={container}
                className="mx-24 text-[45px] font-normal text-white tracking-tight flex flex-wrap justify-center"
            >
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + 1 / words.length;

                    return (
                        <Word
                            key={i}
                            progress={scrollYProgress}
                            range={[start, end]}
                        >
                            {word}
                        </Word>
                    );
                })}
            </h4>
        </div>
    );
};
