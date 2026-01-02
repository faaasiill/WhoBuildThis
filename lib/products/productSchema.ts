import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const productSchema = z.object({
  name: z
    .string({
      required_error: "Project name is required",
    })
    .min(3, "Project name must contain at least 3 characters")
    .max(50, "Project name must not exceed 50 characters"),

  slug: z
    .string({
      required_error: "Slug is required",
    })
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may contain only lowercase letters, numbers, and hyphens"
    )
    .min(3, "Slug must contain at least 3 characters")
    .max(60, "Slug must not exceed 60 characters"),

  tagline: z
    .string({
      required_error: "Tagline is required",
    })
    .min(5, "Tagline must contain at least 5 characters")
    .max(100, "Tagline must not exceed 100 characters"),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, "Description must contain at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),

  webUrl: z
    .string({
      required_error: "Website URL is required",
    })
    .url("Please enter a valid website URL"),

  tags: z
    .array(z.string().min(1))
    .min(1, "Please add at least one tag")
    .max(5, "You can add up to 5 tags only"),

  image: z
    .instanceof(File, {
      message: "Please upload an image file",
    })
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      "Image size must be 5 MB or smaller"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only PNG, JPEG, or WebP images are allowed"
    ),
});