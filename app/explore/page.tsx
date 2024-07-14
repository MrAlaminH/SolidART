"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Skeleton } from "@/components/ui/skeleton";

interface Image {
  ipfsHash: string;
  url: string;
  prompt: string;
  timestamp: string;
}

const Explore: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lovedImages, setLovedImages] = useState<string[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchImages = async (pageNum: number, pageLimit: number = 10) => {
    try {
      setLoading(true);
      const response = await axios.get<{
        images: Image[];
        hasMore: boolean;
        totalCount: number;
      }>(`/api/fetchImageHistory?page=${pageNum}&limit=${pageLimit}`);
      setImages((prevImages) =>
        pageNum === 1
          ? response.data.images
          : [...prevImages, ...response.data.images]
      );
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setPage(pageNum);
    } catch (err: any) {
      setError(
        `Failed to fetch image history: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchImages(page + 1);
    }
  };

  const handleLove = (image: Image) => {
    const lovedImages = JSON.parse(localStorage.getItem("lovedImages") || "[]");
    const isLoved = lovedImages.includes(image.ipfsHash);
    const updatedLovedImages = isLoved
      ? lovedImages.filter((hash: string) => hash !== image.ipfsHash)
      : [...lovedImages, image.ipfsHash];
    localStorage.setItem("lovedImages", JSON.stringify(updatedLovedImages));
    setLovedImages(updatedLovedImages);

    const allImages = JSON.parse(localStorage.getItem("allImages") || "[]");
    if (!allImages.some((img: Image) => img.ipfsHash === image.ipfsHash)) {
      allImages.push(image);
      localStorage.setItem("allImages", JSON.stringify(allImages));
    }
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
    <section id="photos" className="bg-gray-900 min-h-screen">
      <AppNavbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-3xl font-bold mb-8 text-center">
          Your Generated Image History
        </h1>
        {error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading && images.length === 0
                ? Array.from({ length: 8 }).map((_, index) => (
                    <ImageSkeleton key={index} />
                  ))
                : images.map((image) => (
                    <Card
                      key={image.ipfsHash}
                      className="bg-gray-800 text-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleLove(image)}
                                  className={`rounded-full ${
                                    lovedImages.includes(image.ipfsHash)
                                      ? "bg-blue-500 text-white hover:bg-blue-600"
                                      : "bg-gray-200 text-gray-800 hover:text-white"
                                  }`}
                                >
                                  <HeartIcon size={20} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {lovedImages.includes(image.ipfsHash)
                                    ? "Unlike"
                                    : "Like"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  onClick={() =>
                                    handleDownload(
                                      image.url,
                                      `image-${image.ipfsHash}.jpg`
                                    )
                                  }
                                  className="rounded-full bg-gray-200 text-gray-800 hover:bg-blue-500"
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
                        <p className="text-sm text-gray-400">
                          {new Date(image.timestamp).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
            <div className="text-center text-white mt-4">
              Showing {images.length} of {totalCount} images
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;
