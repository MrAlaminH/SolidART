"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, AlertCircle, Sparkles } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import BlurFade from "@/components/magicui/blur-fade";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImagePopup from "@/components/ImagePopup";
import UpgradePro from "@/components/UpgradePro";
import ImageCard from "@/components/explore/ImageCard";

interface ModelOption {
  value: string;
  label: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

const ImageGenerationInterface: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("playground-v2.5");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    prompt: string;
  } | null>(null);
  const [showUpgradePro, setShowUpgradePro] = useState<boolean>(false);

  const modelOptions: ModelOption[] = [
    { value: "playground-v2.5", label: "playground-v2.5" },
    { value: "kandinsky-3.1", label: "kandinsky-3.1" },
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt before generating an image.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.upgradeRequired) {
          setShowUpgradePro(true);
        } else {
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        return;
      }

      const data = await response.json();

      if (!data.imageUrl) {
        throw new Error("No image URL in the response");
      }

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: prompt,
        imageUrl: data.imageUrl,
        timestamp: new Date(),
      };
      setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        setError("Failed to download the image. Please try again.");
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleImageClick = (imageUrl: string, prompt: string) => {
    setSelectedImage({ url: imageUrl, prompt: prompt });
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-white-900 dark:bg-gray-900 min-h-screen">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4 mt-14 md:mt-8">
            SolidART<span className="text-blue-500">.</span>
          </h1>
          <div className="bg-gray-800 text-blue-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm mb-6 inline-block">
            SolidART-2.0 is here!
          </div>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Enter your image prompt"
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="w-full bg-gray-700 text-white rounded-full py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50"
            />
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={handleModelChange}
                disabled={isGenerating}
                className="appearance-none bg-gray-700 text-white rounded-md py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto disabled:opacity-50"
              >
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`${
                isGenerating
                  ? "bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${
                !prompt && !isGenerating ? "opacity-50 cursor-not-allowed" : ""
              } text-white font-bold py-2 px-4 rounded-full text-sm flex-1 sm:flex-none transition duration-150 ease-in-out`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </div>
              ) : (
                "Generate"
              )}
            </button>
          </div>
          {isGenerating && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-900 dark:text-white text-sm">
                {progress}% - Generating image...
              </p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4 text-gray-900 dark:text-white" />
            <AlertTitle className="text-gray-900 dark:text-white">
              Error
            </AlertTitle>
            <AlertDescription className="text-gray-900 dark:text-white">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* History Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-8">
            Your Generated Images 👇
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, idx) => (
              <BlurFade key={item.id} delay={0.25 + idx * 0.05}>
                <ImageCard
                  image={{
                    key: item.id,
                    url: item.imageUrl,
                    prompt: item.prompt,
                    timestamp: item.timestamp.toISOString(),
                  }}
                  onDownload={(url, filename) => handleDownload(url, filename)}
                  onClick={() => handleImageClick(item.imageUrl, item.prompt)}
                />
              </BlurFade>
            ))}
          </div>
        </div>

        {showUpgradePro && (
          <UpgradePro onClose={() => setShowUpgradePro(false)} />
        )}
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <ImagePopup
          selectedImage={selectedImage}
          onClose={handleClosePopup}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default ImageGenerationInterface;
