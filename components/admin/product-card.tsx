"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct, updateProductStatus } from "@/lib/products/product-actions";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    webURL: string;
    webImage: string;
    tags: string[];
    voteCount: number;
    status: string;
    submittedBy: string;
    createdAt: Date;
  };
  index: number;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function ProductCard({
  product,
  index,
  isSelected,
  onSelect,
}: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (newStatus: "approved" | "rejected" | "pending") => {
    startTransition(async () => {
      const result = await updateProductStatus(product.id, newStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setIsDeleting(false);
      }
    });
  };

  const statusColors = {
    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
    approved: "border-green-500/20 bg-green-500/10 text-green-500",
    rejected: "border-red-500/20 bg-red-500/10 text-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-zinc-700 ${
        isDeleting ? "opacity-50" : ""
      } ${isSelected ? "border-zinc-600 bg-zinc-900" : ""}`}
    >
      <div className="flex gap-6">
        {/* Checkbox */}
        {onSelect && (
          <div className="flex items-start pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelect(product.id, checked === true)
              }
              className="border-zinc-700 data-[state=checked]:border-zinc-500 data-[state=checked]:bg-zinc-700"
            />
          </div>
        )}

        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
          <Image
            src={product.webImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold tracking-tighter text-white">
                  {product.name}
                </h3>
                <Badge
                  className={`text-xs font-medium uppercase tracking-tighter ${
                    statusColors[product.status as keyof typeof statusColors]
                  }`}
                >
                  {product.status}
                </Badge>
              </div>
              <p className="text-sm tracking-tight text-zinc-400">
                {product.tagline}
              </p>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-white"
                  disabled={isPending || isDeleting}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-zinc-800 bg-zinc-950"
              >
                <DropdownMenuItem
                  onClick={() => handleStatusChange("approved")}
                  disabled={product.status === "approved"}
                  className="cursor-pointer text-sm tracking-tight"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("rejected")}
                  disabled={product.status === "rejected"}
                  className="cursor-pointer text-sm tracking-tight"
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("pending")}
                  disabled={product.status === "pending"}
                  className="cursor-pointer text-sm tracking-tight"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500" />
                  Set Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-sm tracking-tight text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-zinc-800 text-xs tracking-tight"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs tracking-tight text-zinc-500">
            <span>By {product.submittedBy}</span>
            <span>•</span>
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{product.voteCount} votes</span>
            <span>•</span>
            <a
              href={product.webURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
            >
              View Site
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}