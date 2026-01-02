import { auth, clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth) => {
  const { userId, orgId } = await auth();

  // 🚨 HARD GUARD — middleware runs before auth is ready
  if (!userId) {
    return NextResponse.next();
  }

  // User is logged in but has no org
  if (!orgId) {
    try {
      const client = await clerkClient();

      const { data: memberships } =
        await client.users.getOrganizationMembershipList({
          userId,
        });

      if (memberships.length > 0) {
        return NextResponse.next();
      }

      const user = await client.users.getUser(userId);

      const orgName =
        user.fullName
          ? `${user.fullName}'s Organization`
          : user.username
          ? `${user.username}'s Organization`
          : user.primaryEmailAddress?.emailAddress
          ? `${user.primaryEmailAddress.emailAddress}'s Organization`
          : "My Organization";

      await client.organizations.createOrganization({
        name: orgName,
        createdBy: userId,
      });

      console.log("Auto-created organization:", orgName);
    } catch (error) {
      console.error("Error auto-creating organization:", error);
    }
  }

  return NextResponse.next();
});


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
