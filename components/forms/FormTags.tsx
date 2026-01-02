import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface FormTagsProps {
    name: string;
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    delay?: number;
}

const FormTags = ({ name, label, tags, onChange, delay = 0 }: FormTagsProps) => {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedInput = input.trim();
        if (trimmedInput && !tags.includes(trimmedInput)) {
            onChange([...tags, trimmedInput]);
            setInput("");
        }
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className="space-y-2"
        >
            <Label
                htmlFor={label}
                className="text-xs text-zinc-300 tracking-tight font-medium"
            >
                {label}
            </Label>

            <div className="bg-zinc-900 border border-zinc-800 rounded-md p-2 min-h-[42px] focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all duration-200">
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {tags.map((tag, index) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs tracking-tight border border-zinc-700"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>

                    <input
                        id={label}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={addTag}
                        placeholder={
                            tags.length === 0 ? "AI, SaaS, Productivity" : ""
                        }
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder:text-zinc-600 text-sm tracking-tight"
                    />
                </div>
            </div>

            <input type="hidden" name={name} value={JSON.stringify(tags)} />

            <p className="text-xs text-zinc-500 tracking-tight">
                Press Enter or comma to add tags
            </p>
        </motion.div>
    );
};

export default FormTags;
