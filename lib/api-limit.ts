import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MAX_FREE_COUNTS } from "@/constants";

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

  await prisma.user.update({
    where: { email: userEmail },
    data: { count: { increment: 1 } },
  });
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

  return user.count < MAX_FREE_COUNTS;
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

    return { count: user.count, error: null };
  } catch (error: unknown) {
    console.error("Error in getApiLimitCount:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { count: 0, error: `Error: ${errorMessage}` };
  }
}