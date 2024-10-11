"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import AppNavbar from "@/components/AppNavbar";
import Spinner from "@/components/ui/spinner";
import { MapPinIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(160).optional(),
  location: z.string().max(100).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentData, setCurrentData] = useState<FormData | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false); // New state for edit dialog visibility

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchProfile = async () => {
      try {
        // Check local storage first
        const storedProfile = localStorage.getItem("profileData");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileData(parsedProfile);
          form.reset(parsedProfile);
          setIsLoading(false);
          return;
        }

        // If not in local storage, fetch from API
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          form.reset(data);
          // Store in local storage
          localStorage.setItem("profileData", JSON.stringify(data));
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [form, session, status]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setCurrentData(data); // Ensure currentData includes all fields
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false); // Close the confirmation dialog
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentData), // Ensure currentData has all necessary fields
      });

      if (response.ok) {
        const updatedProfile = await response.json(); // Get the updated profile data
        setProfileData(updatedProfile); // Update the profileData state with the new data
        form.reset(updatedProfile); // Reset the form with the updated profile data

        // Update local storage with the new profile data
        localStorage.setItem("profileData", JSON.stringify(updatedProfile));

        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
        setShowEditDialog(false); // Close the edit dialog after successful save
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProfileSkeleton = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
    </Card>
  );

  if (status === "loading" || isLoading) {
    return <ProfileSkeleton />;
  }

  if (!session) {
    return <div>You need to be authenticated to view this page.</div>;
  }

  return (
    <>
      <AppNavbar />
      <Card className="w-full max-w-4xl mx-auto mt-12">
        <CardHeader className="flex flex-row justify-between items-start">
          <div className="flex items-center space-x-4">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon size={40} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {profileData?.name || "Add name"}
              </h2>
              <p className="text-sm text-gray-500">
                @
                {profileData?.name?.toLowerCase().replace(/\s+/g, "") ||
                  "username"}
              </p>
            </div>
          </div>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowEditDialog(true)}>
                Edit profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Max 160 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Your location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">{profileData?.bio || "No bio yet."}</p>
            <p className="text-sm flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span>{profileData?.location || "No location specified."}</span>
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save these changes?</p>
          <Button onClick={handleConfirmSubmit} className="mt-4">
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirm(false)}
            className="mt-2"
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePage;
