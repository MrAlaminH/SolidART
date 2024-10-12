"use client";
import React, { useState, useEffect } from "react";
import { HeartIcon, DownloadIcon, CopyIcon, CheckIcon } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton"; // Import the existing Skeleton component
import Image from "next/image"; // Import the Image component from next/image
import { motion } from "framer-motion";

interface Image {
  ipfsHash: string;
  url: string;
  prompt: string;
  timestamp: string;
}

const LovedImages: React.FC = () => {
  const [lovedImages, setLovedImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  useEffect(() => {
    const fetchLovedImages = () => {
      try {
        setLoading(true);
        const lovedImageHashes = JSON.parse(
          localStorage.getItem("lovedImages") || "[]"
        );
        const allImages = JSON.parse(localStorage.getItem("allImages") || "[]");
        const loved = allImages.filter((img: Image) =>
          lovedImageHashes.includes(img.ipfsHash)
        );
        setLovedImages(loved);
      } catch (err: any) {
        setError(`Failed to fetch loved images: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLovedImages();

    // Set up an event listener for storage changes
    window.addEventListener("storage", fetchLovedImages);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", fetchLovedImages);
    };
  }, []);

  const handleUnlove = (image: {
    ipfsHash: string;
    url: string;
    prompt: string;
    timestamp: string;
  }) => {
    const updatedLovedImages = lovedImages.filter(
      (img) => img.ipfsHash !== image.ipfsHash
    );
    setLovedImages(updatedLovedImages);

    // Update localStorage
    const lovedImageHashes = updatedLovedImages.map((img) => img.ipfsHash);
    localStorage.setItem("lovedImages", JSON.stringify(lovedImageHashes));
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const ImageSkeleton = () => (
    <Card className="bg-gray-800 text-white overflow-hidden">
      <Skeleton className="w-full aspect-square bg-gray-700" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-1/2 bg-gray-700" />
      </CardContent>
    </Card>
  );

  return (
    <section
      id="loved-photos"
      className="bg-white dark:bg-gray-900 min-h-screen"
    >
      <AppNavbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-12 md:mt-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-gray-900 dark:text-white text-3xl font-bold mb-8 mt-8 text-center"
        >
          Your Loved Images
        </motion.h1>
        {error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ImageSkeleton key={index} />
              ))
            ) : lovedImages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="col-span-full text-center text-gray-900 dark:text-white text-xl"
              >
                You haven&apos;t loved any images yet.
              </motion.div>
            ) : (
              lovedImages.map((image) => (
                <Card
                  key={image.ipfsHash}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      layout="fill" // Use layout fill for responsive images
                      objectFit="cover" // Maintain aspect ratio
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent popup from opening
                                handleUnlove(image); // Pass the entire image object
                              }}
                              className="rounded-full bg-blue-500 text-white"
                            >
                              <HeartIcon size={20} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from Loved</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent popup from opening
                                handleDownload(
                                  image.url,
                                  `image-${image.ipfsHash}.jpg`
                                );
                              }}
                              className="rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300"
                            >
                              <DownloadIcon size={20} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold truncate flex-grow mr-2">
                        {image.prompt}
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyPrompt(image.prompt)}
                              className="shrink-0"
                            >
                              {copiedPrompt === image.prompt ? (
                                <CheckIcon size={16} />
                              ) : (
                                <CopyIcon size={16} />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {copiedPrompt === image.prompt
                                ? "Copied!"
                                : "Copy prompt"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(image.timestamp).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LovedImages;
