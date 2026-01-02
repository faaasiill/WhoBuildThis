"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import {
  upvoteProductAction,
  downvoteProductAction,
} from "@/lib/products/product-actions";

type VoteCounterProps = {
  vote: number;
  projectId: string;
};

type VoteType = "up" | "down" | null;

export default function VoteCounter({ vote, projectId }: VoteCounterProps) {
  const [localVote, setLocalVote] = useState(vote);
  const [isVoting, setIsVoting] = useState(false);
  const [voteType, setVoteType] = useState<VoteType>(null);

  const { userId, isLoaded } = useAuth();

  // Load persisted vote
  useEffect(() => {
    const stored = localStorage.getItem(`vote:${projectId}`);
    if (stored === "up" || stored === "down") {
      setVoteType(stored);
    }
  }, [projectId]);

  const handleVote = async (type: VoteType) => {
    if (!isLoaded) return;

    if (!userId) {
      toast("Please login to vote");
      return;
    }

    if (isVoting || voteType) return;

    setIsVoting(true);
    setVoteType(type);
    setLocalVote((v) => (type === "up" ? v + 1 : v - 1));

    try {
      if (type === "up") {
        await upvoteProductAction(projectId);
      } else {
        await downvoteProductAction(projectId);
      }

      localStorage.setItem(`vote:${projectId}`, type!);
    } catch (err) {
      // rollback
      setVoteType(null);
      setLocalVote((v) => (type === "up" ? v - 1 : v + 1));

      toast.error("Vote failed. Try again.");
      console.error("Vote failed", err);
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
      className="flex flex-col items-center justify-center flex-shrink-0 rounded-full backdrop-blur-xs"
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
      <h5 className="text-xs font-bold tracking-tighter text-white/80 text-center leading-none select-none">
        {localVote}
      </h5>

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
