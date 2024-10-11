"use client";

import React, { useState, useCallback } from "react";
import {
  DownloadIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImagePopupProps {
  selectedImage: { url: string; prompt: string };
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  selectedImage,
  onClose,
  onDownload,
}) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleZoomIn = useCallback(
    () => setScale((prev) => Math.min(prev + 0.1, 3)),
    []
  );
  const handleZoomOut = useCallback(
    () => setScale((prev) => Math.max(prev - 0.1, 0.5)),
    []
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  }, []);

  const copyToClipboard = useCallback(() => {
    if (selectedImage?.prompt) {
      navigator.clipboard.writeText(selectedImage.prompt).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-lg p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="overflow-hidden"
            onWheel={handleWheel}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              style={{ scale }}
            >
              <Image
                src={selectedImage.url}
                alt="Selected"
                className="w-full h-auto object-contain"
                width={1000}
                height={1000}
                priority
              />
            </motion.div>
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      onDownload(selectedImage.url, `downloaded-image.jpg`)
                    }
                    className="rounded-full bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white p-2 transition-colors duration-200"
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
                    onClick={handleZoomIn}
                    className="rounded-full bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white p-2 transition-colors duration-200"
                  >
                    <ZoomInIcon size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleZoomOut}
                    className="rounded-full bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white p-2 transition-colors duration-200"
                  >
                    <ZoomOutIcon size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={copyToClipboard}
                    className="rounded-full bg-gray-200 text-gray-800 hover:bg-green-500 hover:text-white p-2 transition-colors duration-200"
                  >
                    {isCopied ? (
                      <CheckIcon size={20} />
                    ) : (
                      <CopyIcon size={20} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? "Copied!" : "Copy Prompt"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 left-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors duration-200"
          >
            <XIcon size={24} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePopup;
