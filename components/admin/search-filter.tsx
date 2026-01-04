"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface SearchFilterProps {
  availableTags: string[];
}

export default function SearchFilter({ availableTags }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setSelectedTags([]);
    startTransition(() => {
      router.push("/admin");
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by name, tagline, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-zinc-800 bg-black pl-10 text-sm tracking-tight placeholder:text-zinc-600"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] border-zinc-800 bg-black text-sm tracking-tight">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-950">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="bg-zinc-200 text-sm tracking-tight text-black hover:bg-white"
        >
          {isPending ? "Filtering..." : "Filter"}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className="border-zinc-800 text-sm tracking-tight hover:bg-zinc-900"
        >
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>

      {availableTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-tighter text-zinc-500">
            Filter by Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer text-xs tracking-tight transition-colors ${
                  selectedTags.includes(tag)
                    ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}