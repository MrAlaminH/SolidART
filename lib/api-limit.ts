import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MAX_FREE_COUNTS } from "@/constants";

const MS_IN_A_DAY = 24 * 60 * 60 * 1000; // Milliseconds in a day

export async function incrementApiLimit() {
  const session = await auth();
  if (!session?.user?.email) {
    return;
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return;
  }

  // Check if 24 hours have passed since the last reset
  const now = new Date();
  if (now.getTime() - user.lastReset.getTime() > MS_IN_A_DAY) {
    // Reset the count
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        count: 1, // Start at 1 since we are incrementing
        lastReset: now, // Update the last reset timestamp
      },
    });
  } else {
    // Increment the count
    await prisma.user.update({
      where: { email: userEmail },
      data: { count: { increment: 1 } },
    });
  }
}

export async function checkApiLimit() {
  const session = await auth();
  if (!session?.user?.email) {
    return false;
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return false;
  }

  // Check if 24 hours have passed since the last reset
  const now = new Date();
  if (now.getTime() - user.lastReset.getTime() > MS_IN_A_DAY) {
    return true; // User can use the API again
  }

  return user.count < MAX_FREE_COUNTS; // Check count against the limit
}

export async function getApiLimitCount() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      console.log("No user session found");
      return { count: 0, error: "No user session found" };
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.log("User not found in database");
      return { count: 0, error: "User not found in database" };
    }

    // Check if 24 hours have passed since the last reset
    const now = new Date();
    if (now.getTime() - user.lastReset.getTime() > MS_IN_A_DAY) {
      return { count: 0, error: null }; // User count is reset
    }

    return { count: user.count, error: null };
  } catch (error: unknown) {
    console.error("Error in getApiLimitCount:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { count: 0, error: `Error: ${errorMessage}` };
  }
}



