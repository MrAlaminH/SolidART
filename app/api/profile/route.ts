import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET method to fetch user profile
export async function GET(req: NextRequest) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail: string = session.user.email;

  try {
    // Fetch user profile from the database
    const userProfile = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        name: true,
        bio: true, // Ensure this field is included
        location: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        socialLinks: true, // Include socialLinks in the select object
      },
    });

    // Handle case where profile is not found
    if (!userProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Return the user profile data
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile data:", error); // Log the error for debugging
    return NextResponse.json({ message: "Error fetching profile data", error: (error as Error).message }, { status: 500 });
  }
}

// PUT method to update user profile
export async function PUT(req: NextRequest) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail: string = session.user.email;

  try {
    // Parse the incoming request body
    const { name, bio, location, socialLinks } = await req.json();

    // Update the user profile in the database
    const updatedProfile = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name,
        bio, // Ensure this field is included
        location,
        socialLinks, // Include socialLinks in the data object
      },
    });

    // Return the updated profile data
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error fetching profile data:", error); // Log the error for debugging
    return NextResponse.json({ message: "Error fetching profile data", error: (error as Error).message }, { status: 500 });
  }
}