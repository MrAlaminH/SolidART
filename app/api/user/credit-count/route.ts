import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ count: 0, error: "No user session found" });
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ count: 0, error: "User not found in database" });
    }

    return NextResponse.json({ count: user.count, error: null });
  } catch (error) {
    console.error("Error in getApiLimitCount:", error);
    return NextResponse.json({ count: 0, error: "Internal server error" });
  }
}