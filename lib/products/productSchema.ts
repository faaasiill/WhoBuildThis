import { z } from "zod";

/* ---------------------------
   Constants
---------------------------- */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

/* ---------------------------
   Helpers
---------------------------- */

const fileSchema = z.custom<File>((value) => value instanceof File, {
  message: "Please upload an image file",
});

/* ---------------------------
   Schema
---------------------------- */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Project name is required" })
    .min(3, { message: "Project name must contain at least 3 characters" })
    .max(50, { message: "Project name must not exceed 50 characters" }),

  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug may contain only lowercase letters, numbers, and hyphens",
    })
    .min(3, { message: "Slug must contain at least 3 characters" })
    .max(60, { message: "Slug must not exceed 60 characters" }),

  tagline: z
    .string()
    .min(1, { message: "Tagline is required" })
    .min(5, { message: "Tagline must contain at least 5 characters" })
    .max(100, { message: "Tagline must not exceed 100 characters" }),

  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must contain at least 10 characters" })
    .max(1000, {
      message: "Description must not exceed 1000 characters",
    }),

  webUrl: z
    .string()
    .min(1, { message: "Website URL is required" })
    .url({ message: "Please enter a valid website URL" }),

  tags: z
    .array(z.string().min(1))
    .min(1, { message: "Please add at least one tag" })
    .max(5, { message: "You can add up to 5 tags only" }),

  image: fileSchema
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size must be 5 MB or smaller",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type as any), {
      message: "Only PNG, JPEG, or WebP images are allowed",
    }),
});

/* ---------------------------
   Types
---------------------------- */
export type ProductInput = z.input<typeof productSchema>;
export type ProductOutput = z.output<typeof productSchema>;
