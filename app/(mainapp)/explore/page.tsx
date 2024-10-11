"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import AppNavbar from "@/components/AppNavbar";
import ImageCard from "@/components/explore/ImageCard";
import ImagePopup from "@/components/ImagePopup"; // Import the ImagePopup component
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { motion } from "framer-motion";

interface ImageObject {
  key: string;
  url: string;
  prompt: string;
  timestamp: string;
}

interface ApiResponse {
  images: ImageObject[];
  hasMore: boolean;
  page: number;
  totalImages: number;
}

const Explore: React.FC = () => {
  const [images, setImages] = useState<ImageObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    prompt: string;
  } | null>(null); // State for the selected image

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent duplicate fetches
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>("/api/fetchImageHistory", {
        params: { page, limit: 12 },
      });

      setImages((prevImages) => {
        const newImages = response.data.images.filter(
          (newImage) =>
            !prevImages.some((prevImage) => prevImage.key === newImage.key)
        ); // Avoid duplicates
        return [...prevImages, ...newImages].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() // Sort by most recent
        );
      });

      setHasMore(response.data.hasMore);
    } catch (err: any) {
      setError(`Failed to fetch images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page]); // Only depend on page

  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Fetch more images when scrolled to the bottom
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchImages();
  }, [page, fetchImages]); // Depend on page and fetchImages

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

  const handleImageClick = (image: ImageObject) => {
    setSelectedImage({ url: image.url, prompt: image.prompt });
  };

  const handleClosePopup = () => {
    setSelectedImage(null); // Close the popup
  };

  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-900 min-h-screen">
      <AppNavbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-3xl font-bold mb-8 mt-8 text-center"
        >
          Explore Others People Generated Image
        </motion.h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.length === 0 && loading
            ? renderSkeletons()
            : images.map((image, index) => (
                <ImageCard
                  key={image.key}
                  image={image}
                  onDownload={handleDownload}
                  onClick={() => handleImageClick(image)}
                  ref={index === images.length - 1 ? lastImageElementRef : null} // Pass ref only to the last image
                />
              ))}
        </div>
        {loading && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {renderSkeletons()}
          </div>
        )}
        {!hasMore && !loading && (
          <div className="flex justify-center items-center mt-8 mb-8">
            <p className="text-white">No more images Left to load</p>
          </div>
        )}
      </div>
      {selectedImage && (
        <ImagePopup
          selectedImage={selectedImage}
          onClose={handleClosePopup}
          onDownload={handleDownload}
        />
      )}
    </section>
  );
};

export default Explore;
