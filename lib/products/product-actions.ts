"use server";

import { productSchema } from "./productSchema";
import { db } from "@/db";
import { products } from "@/db/schema";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addProduct = async (formData: FormData) => {
    try {
        const { userId, orgId } = await auth();
        console.log(orgId);

        // check user exist.
        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to submit a project",
            };
        }

        if (!orgId) {
            return {
                success: false,
                message:
                    "You must be a member of an organization to submit a project",
            };
        }

        const user = await currentUser();
        const userEmail = user?.emailAddresses[0].emailAddress || "anonymous";

        // Convert FormData → object
        const rawData = Object.fromEntries(formData.entries());

        const parsedData = {
            ...rawData,
            tags: JSON.parse(rawData.tags as string),
        };

        // Validate
        const validatedData = productSchema.parse(parsedData);

        // ⬆️ Upload image to Cloudinary
        const webImage = await uploadImageToCloudinary(
            validatedData.image,
            "projects"
        );

        // ⬇️ Prepare DB payload (NO File object)
        const productToSave = {
            name: validatedData.name,
            slug: validatedData.slug,
            tagline: validatedData.tagline,
            description: validatedData.description,
            webURL: validatedData.webUrl,
            webImage,
            tags: validatedData.tags,
            status: "pending",
            submittedBy: userEmail,
            userId,
            organizationId: orgId,
        };

        await db.insert(products).values(productToSave);

        return {
            success: true,
            message:
                "Project submitted successfully! it will be reviewed shortly",
        };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const firstErrorMessage = err.issues[0]?.message ?? "Invalid input";

            return {
                success: false,
                message: firstErrorMessage,
                errors: err.flatten().fieldErrors,
            };
        }

        console.error(err);

        return {
            success: false,
            message: "Failed to submit product",
        };
    }
};

export const upvoteProductAction = async (productId: string) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to upvote a project",
            };
        }

        if (!orgId) {
            return {
                success: false,
                message:
                    "You must be a member of an organization to upvote a project",
            };
        }

        const result = await db
            .update(products)
            .set({
                voteCount: sql`GREATEST(0, vote_count + 1)`,
            })
            .where(eq(products.id, productId))
            .returning({ voteCount: products.voteCount });

        if (result.length === 0) {
            return {
                success: false,
                message: "Product not found",
            };
        }

        revalidatePath("/");
        return {
            success: true,
            voteCount: result[0].voteCount,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to upvote product",
        };
    }
};

export const downvoteProductAction = async (productId: string) => {
    try {
        const { userId, orgId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "You must be signed in to downvote a project",
            };
        }

        if (!orgId) {
            return {
                success: false,
                message:
                    "You must be a member of an organization to downvote a project",
            };
        }

        const result = await db
            .update(products)
            .set({
                voteCount: sql`GREATEST(0, vote_count - 1)`,
            })
            .where(eq(products.id, productId))
            .returning({ voteCount: products.voteCount });

        if (result.length === 0) {
            return {
                success: false,
                message: "Product not found",
            };
        }

        revalidatePath("/");
        return {
            success: true,
            voteCount: result[0].voteCount,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to downvote product",
        };
    }
};
