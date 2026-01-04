"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import {
  upvoteProductAction,
  downvoteProductAction,
} from "@/lib/products/product-actions";

type VoteType = "up" | "down" | null;

export default function InlineVote({
  initialVote,
  productId,
}: {
  initialVote: number;
  productId: string;
}) {
  const [vote, setVote] = useState(initialVote);
  const [voteType, setVoteType] = useState<VoteType>(null);
  const [isVoting, setIsVoting] = useState(false);

  const { userId, isLoaded } = useAuth();

  // Load persisted vote
  useEffect(() => {
    const stored = localStorage.getItem(`vote:${productId}`);
    if (stored === "up" || stored === "down") {
      setVoteType(stored);
    }
  }, [productId]);

  const handleVote = async (type: VoteType) => {
    if (!isLoaded) return;

    // 🔔 Not logged in → show message only
    if (!userId) {
      toast("Please login to vote");
      return;
    }

    if (isVoting || voteType) return;

    setIsVoting(true);
    setVoteType(type);
    setVote((v) => (type === "up" ? v + 1 : v - 1));

    try {
      if (type === "up") {
        await upvoteProductAction(productId);
      } else {
        await downvoteProductAction(productId);
      }

      localStorage.setItem(`vote:${productId}`, type!);
    } catch (error) {
      // rollback
      setVoteType(null);
      setVote((v) => (type === "up" ? v - 1 : v + 1));

      toast.error("Vote failed. Try again.");
      console.error("Vote failed", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex items-center gap-3"
    >
      {/* UPVOTE */}
      <button
        onClick={() => handleVote("up")}
        aria-label="Upvote"
        className={clsx(
          "w-9 h-9 rounded-full flex items-center justify-center transition",
          {
            "text-green-400": voteType === "up",
            "hover:scale-110": voteType === null,
          }
        )}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* COUNT */}
      <span className="text-sm font-medium tracking-tight text-white/90 min-w-[24px] text-center select-none">
        {vote}
      </span>

      {/* DOWNVOTE */}
      <button
        onClick={() => handleVote("down")}
        aria-label="Downvote"
        className={clsx(
          "w-9 h-9 rounded-full flex items-center justify-center transition",
          {
            "text-red-400": voteType === "down",
            "hover:scale-110": voteType === null,
          }
        )}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
}
