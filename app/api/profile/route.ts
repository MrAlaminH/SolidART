import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Function to handle unauthorized requests
const handleUnauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// Function to handle errors
const handleError = (message: string, error: any) => {
  console.error(`${message}:`, error); // Log error details
  return NextResponse.json(
    { message, error: (error as Error).message },
    { status: 500 }
  );
};

// GET method to fetch user profile
export async function GET(req: NextRequest) {
  const session = await auth();

  // Early return if unauthorized
  if (!session?.user?.email) return handleUnauthorized();

  const userEmail: string = session.user.email;

  try {
    // Fetch user profile with minimal required fields
    const userProfile = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        name: true,
        bio: true,
        location: true,
        email: true,
        image: true,
        socialLinks: true, // Include only necessary fields
        updatedAt: true, // Might be useful for caching mechanisms
      },
    });

    // Return 404 if no profile is found
    if (!userProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Return the user profile data
    return NextResponse.json(userProfile);
  } catch (error) {
    // Use the handleError function for cleaner code
    return handleError("Error fetching profile data", error);
  }
}

// PUT method to update user profile
export async function PUT(req: NextRequest) {
  const session = await auth();

  // Early return if unauthorized
  if (!session?.user?.email) return handleUnauthorized();

  const userEmail: string = session.user.email;

  try {
    // Parse incoming request body
    const { name, bio, location, socialLinks } = await req.json();

    // Ensure the required fields are provided
    if (!name || !bio || !location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name,
        bio,
        location,
        socialLinks,
      },
    });

    // Return the updated profile data
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return handleError("Error updating profile data", error);
  }
}
