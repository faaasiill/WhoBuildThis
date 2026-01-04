"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bulkUpdateStatus,
  deleteProduct,
} from "@/lib/products/product-actions";
import { motion } from "framer-motion";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedIds,
  onClearSelection,
}: BulkActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<string>("");

  const handleBulkAction = () => {
    if (!action || selectedIds.length === 0) return;

    if (action === "delete") {
      if (
        !confirm(
          `Are you sure you want to delete ${selectedIds.length} product(s)?`
        )
      )
        return;

      startTransition(async () => {
        let successCount = 0;
        for (const id of selectedIds) {
          const result = await deleteProduct(id);
          if (result.success) successCount++;
        }
        toast.success(`${successCount} product(s) deleted`);
        onClearSelection();
      });
    } else {
      const statusMap: Record<string, "approved" | "rejected" | "pending"> = {
        approve: "approved",
        reject: "rejected",
        pending: "pending",
      };

      startTransition(async () => {
        const result = await bulkUpdateStatus(selectedIds, statusMap[action]);
        if (result.success) {
          toast.success(result.message);
          onClearSelection();
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
        <p className="text-sm font-medium tracking-tight text-white">
          {selectedIds.length} selected
        </p>

        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-[180px] border-zinc-700 bg-zinc-950 text-sm tracking-tight">
            <SelectValue placeholder="Choose action" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-900">
            <SelectItem value="approve" className="text-sm tracking-tight">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Approve
              </div>
            </SelectItem>
            <SelectItem value="reject" className="text-sm tracking-tight">
              <div className="flex items-center">
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Reject
              </div>
            </SelectItem>
            <SelectItem value="pending" className="text-sm tracking-tight">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500" />
                Set Pending
              </div>
            </SelectItem>
            <SelectItem value="delete" className="text-sm tracking-tight">
              <div className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleBulkAction}
          disabled={!action || isPending}
          size="sm"
          className="bg-zinc-200 text-sm tracking-tight text-black hover:bg-white"
        >
          {isPending ? "Processing..." : "Apply"}
        </Button>

        <Button
          onClick={onClearSelection}
          variant="ghost"
          size="sm"
          className="text-sm tracking-tight text-zinc-400 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
