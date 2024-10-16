// "use client";
import React, { forwardRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  MoreVerticalIcon,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton, ImageCardSkeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

// Interface definitions for the image object and component props
interface ImageObject {
  key: string;
  url: string;
  prompt: string;
  timestamp: string;
}

interface ImageCardProps {
  image: ImageObject;
  onDownload: (url: string, filename: string) => void;
  onClick: () => void;
}

const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, onDownload, onClick }, ref) => {
    // State management for copy functionality and device detection
    const [isCopied, setIsCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Effect to detect mobile devices based on screen width
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Function to handle copying text to clipboard
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    };

    // Component for action buttons (download and copy)
    const ActionButtons = () => (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image.url, `image-${image.key}.jpg`);
                }}
                className="rounded-full bg-white/90 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors"
                aria-label="Download image"
              >
                <DownloadIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
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
                  e.stopPropagation();
                  copyToClipboard(image.prompt);
                }}
                className="rounded-full bg-white/90 text-gray-800 hover:bg-green-500 hover:text-white transition-colors"
                aria-label="Copy prompt"
              >
                {isCopied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCopied ? "Copied!" : "Copy Prompt"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );

    if (!image.url) {
      return <ImageCardSkeleton />;
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Card
          className="bg-gray-800 text-white overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
          ref={ref}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={image.url}
              alt={image.prompt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            {/* Permanent prompt overlay for both desktop and mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-2 left-2 right-2">
                <h2
                  className={`font-semibold truncate mb-1 text-white drop-shadow-md ${
                    isMobile ? "text-sm" : "text-lg"
                  }`}
                >
                  {image.prompt}
                </h2>
              </div>
            </div>

            {/* Action buttons for desktop view */}
            <AnimatePresence>
              {isHovered && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 flex space-x-2"
                >
                  <ActionButtons />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile dropdown menu */}
            {isMobile && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                      aria-label="More options"
                    >
                      <MoreVerticalIcon size={16} className="text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(image.url, `image-${image.key}.jpg`);
                      }}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.prompt);
                      }}
                    >
                      <CopyIcon className="mr-2 h-4 w-4" />
                      <span>Copy Prompt</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }
);

ImageCard.displayName = "ImageCard";

export default ImageCard;
