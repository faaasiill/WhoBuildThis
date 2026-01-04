"use server";

import { productSchema } from "./productSchema";
import { db } from "@/db";
import { products } from "@/db/schema";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ProductStatus = "pending" | "approved" | "rejected";

export const addProduct = async (formData: FormData) => {
  try {
    const { userId, orgId } = await auth();
    console.log(orgId);

    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to submit a project",
      };
    }

    if (!orgId) {
      return {
        success: false,
        message: "You must be a member of an organization to submit a project",
      };
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0].emailAddress || "anonymous";

    // Convert FormData to object
    const rawData = Object.fromEntries(formData.entries());

    const parsedData = {
      ...rawData,
      tags: JSON.parse(rawData.tags as string),
    };

    // Validate
    const validatedData = productSchema.parse(parsedData);

    // Upload image to Cloudinary
    const webImage = await uploadImageToCloudinary(
      validatedData.image,
      "projects"
    );

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
      message: "Project submitted successfully! it will be reviewed shortly",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        message: "You must be a member of an organization to upvote a project",
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
    revalidatePath("/explore");
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
    revalidatePath("/explore");
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

async function checkAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    return { isAdmin: false, error: "You must be signed in" };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata;
  const isAdmin = metadata?.isAdmin ?? false;

  if (!isAdmin) {
    return { isAdmin: false, error: "Unauthorized: Admin access required" };
  }

  return { isAdmin: true, error: null };
}

export async function updateProductStatus(
  productId: string,
  newStatus: ProductStatus
) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      return {
        success: false,
        message: adminCheck.error,
      };
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    // Set approvedAt timestamp when approving
    if (newStatus === "approved") {
      updateData.approvedAt = new Date();
    }

    await db.update(products).set(updateData).where(eq(products.id, productId));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/explore");

    return {
      success: true,
      message: `Product ${newStatus} successfully`,
    };
  } catch (error) {
    console.error("Error updating product status:", error);
    return {
      success: false,
      message: "Failed to update product status",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      return {
        success: false,
        message: adminCheck.error,
      };
    }

    await db.delete(products).where(eq(products.id, productId));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/explore");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}

export async function bulkUpdateStatus(
  productIds: string[],
  newStatus: ProductStatus
) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      return {
        success: false,
        message: adminCheck.error,
      };
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === "approved") {
      updateData.approvedAt = new Date();
    }

    // Update each product
    await Promise.all(
      productIds.map((id) =>
        db.update(products).set(updateData).where(eq(products.id, id))
      )
    );

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/explore");

    return {
      success: true,
      message: `${productIds.length} products ${newStatus} successfully`,
    };
  } catch (error) {
    console.error("Error bulk updating products:", error);
    return {
      success: false,
      message: "Failed to update products",
    };
  }
}
