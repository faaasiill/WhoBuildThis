"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useState } from "react";
import ProductCard from "./product-card";
import BulkActions from "./bulk-action";

interface ProductListProps {
  products: Array<{
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
  }>;
  title: string;
  emptyMessage: string;
  enableBulkActions?: boolean;
}

export default function ProductList({
  products,
  title,
  emptyMessage,
  enableBulkActions = true,
}: ProductListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const allSelected =
    products.length > 0 && selectedIds.length === products.length;

  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-bold tracking-tighter text-white"
        >
          {title}
        </motion.h2>

        {enableBulkActions && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm tracking-tight text-zinc-500">
              Select All
            </span>
          </motion.div>
        )}
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950 py-16"
        >
          <Package className="mb-4 h-12 w-12 text-zinc-700" />
          <p className="text-sm tracking-tight text-zinc-500">{emptyMessage}</p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-3">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isSelected={selectedIds.includes(product.id)}
                onSelect={enableBulkActions ? handleSelect : undefined}
              />
            ))}
          </div>

          {enableBulkActions && (
            <BulkActions
              selectedIds={selectedIds}
              onClearSelection={() => setSelectedIds([])}
            />
          )}
        </>
      )}
    </div>
  );
}
