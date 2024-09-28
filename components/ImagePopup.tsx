"use client";
import React from "react";
import { HeartIcon, DownloadIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image"; // Import the Image component from next/image

interface ImagePopupProps {
  selectedImage: string | null;
  lovedImages: string[];
  onClose: () => void;
  onLove: (image: {
    ipfsHash: string;
    url: string;
    prompt: string;
    timestamp: string;
  }) => void;
  onDownload: (url: string, filename: string) => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  selectedImage,
  lovedImages,
  onClose,
  onLove,
  onDownload,
}) => {
  if (!selectedImage) return null;

  const handleLoveClick = () => {
    onLove({
      ipfsHash: selectedImage,
      url: selectedImage,
      prompt: "",
      timestamp: "",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose} // Close popup on overlay click
    >
      <div className="relative max-w-4xl max-h-3/4 overflow-hidden bg-white rounded-lg shadow-lg p-2">
        <Image // Use the Image component instead of img
          src={selectedImage}
          alt="Selected"
          className="w-full h-auto max-h-120 object-contain" // Limit the height and maintain aspect ratio
          layout="responsive" // Optional: Adjust layout as needed
          width={500} // Set a width for the image
          height={300} // Set a height for the image
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    onDownload(selectedImage, `downloaded-image.jpg`)
                  }
                  className="rounded-full bg-gray-200 text-gray-800 hover:bg-blue-500 p-1"
                >
                  <DownloadIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLoveClick}
                  className={`rounded-full ${
                    lovedImages.includes(selectedImage)
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-800 hover:text-white"
                  } p-1`}
                >
                  <HeartIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{lovedImages.includes(selectedImage) ? "Unlike" : "Like"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 transition"
        >
          <XIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;
