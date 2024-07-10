// "use client";
// import React, { useState } from "react";
// import { Search, ChevronDown, DownloadIcon, AlertCircle } from "lucide-react";
// import AppNavbar from "@/components/AppNavbar";
// import BlurFade from "@/components/magicui/blur-fade";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// interface ModelOption {
//   value: string;
//   label: string;
// }

// interface HistoryItem {
//   id: string;
//   prompt: string;
//   imageUrl: string;
//   timestamp: Date;
// }

// const ImageGenerationInterface: React.FC = () => {
//   const [prompt, setPrompt] = useState<string>("");
//   const [selectedModel, setSelectedModel] = useState<string>("playground-v2.5");
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const modelOptions: ModelOption[] = [
//     { value: "playground-v2.5", label: "SolidART-v2.0" },
//     { value: "kandinsky-3.1", label: "SolidART-v1.0" },
//     // Add more model options here
//   ];

//   const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPrompt(e.target.value);
//   };

//   const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedModel(e.target.value);
//   };

//   const handleGenerate = async () => {
//     if (!prompt) {
//       setError("Please enter a prompt before generating an image.");
//       return;
//     }

//     setIsGenerating(true);
//     setError(null);

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

//     try {
//       const response = await fetch("/api/generate-image", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt, model: selectedModel }),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       if (!data.imageUrl) {
//         throw new Error("No image URL in the response");
//       }

//       const newHistoryItem: HistoryItem = {
//         id: Date.now().toString(),
//         prompt: prompt,
//         imageUrl: data.imageUrl,
//         timestamp: new Date(),
//       };
//       setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
//       setPrompt(""); // Clear the prompt after successful generation
//     } catch (error) {
//       console.error("Error generating image:", error);
//       if (error instanceof Error) {
//         if (error.name === "AbortError") {
//           setError(
//             "Request timed out. The server might be busy. Please try again later."
//           );
//         } else {
//           setError(error.message);
//         }
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownload = (url: string, filename: string) => {
//     fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       })
//       .catch((error) => {
//         console.error("Error downloading image:", error);
//         setError("Failed to download the image. Please try again.");
//       });
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen">
//       <AppNavbar />
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
//             SolidART.
//           </h1>
//           <div className="bg-gray-800 text-blue-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm mb-6 inline-block">
//             SolidART-2.0 is here!
//           </div>
//         </div>
//         <div className="max-w-2xl mx-auto mb-8">
//           <div className="relative mb-4">
//             <input
//               type="text"
//               placeholder="Enter your image prompt"
//               value={prompt}
//               onChange={handlePromptChange}
//               className="w-full bg-gray-700 text-white rounded-full py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//             />
//             <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//           </div>
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="relative">
//               <select
//                 value={selectedModel}
//                 onChange={handleModelChange}
//                 className="appearance-none bg-gray-700 text-white rounded-md py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
//               >
//                 {modelOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             </div>
//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className={`${
//                 isGenerating
//                   ? "bg-blue-600 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               } text-white font-bold py-2 px-4 rounded-full text-sm flex-1 sm:flex-none transition duration-150 ease-in-out`}
//             >
//               {isGenerating ? "Generating..." : "Generate"}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-4 max-w-2xl mx-auto">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* History Section */}
//         <div className="max-w-6xl mx-auto">
//           {" "}
//           {/* Increased max-width */}
//           <h2 className="text-white text-2xl font-bold mb-4">
//             Generated Images
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {" "}
//             {/* Adjusted grid and gap */}
//             {history.map((item, idx) => (
//               <BlurFade key={item.id} delay={0.25 + idx * 0.05}>
//                 <div className="relative group bg-gray-800 rounded-lg overflow-hidden">
//                   <img
//                     className="w-full h-64 sm:h-72 md:h-80 object-cover"
//                     src={item.imageUrl}
//                     alt={item.prompt}
//                     loading="lazy"
//                   />
//                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <button
//                       onClick={() =>
//                         handleDownload(item.imageUrl, `image-${item.id}.jpg`)
//                       }
//                       className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
//                     >
//                       <DownloadIcon size={24} /> {/* Increased icon size */}
//                     </button>
//                   </div>
//                   <div className="p-4">
//                     <p className="text-white text-sm truncate mb-1">
//                       {item.prompt}
//                     </p>
//                     <p className="text-gray-400 text-xs">
//                       {item.timestamp.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </BlurFade>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageGenerationInterface;

"use client";
import React, { useState } from "react";
import { Search, ChevronDown, DownloadIcon, AlertCircle } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import BlurFade from "@/components/magicui/blur-fade";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const modelOptions: ModelOption[] = [
    { value: "playground-v2.5", label: "SolidART-v2.0" },
    { value: "kandinsky-3.1", label: "SolidART-v1.0" },
    // Add more model options here
  ];

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt before generating an image.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

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
      setPrompt(""); // Clear the prompt after successful generation
    } catch (error) {
      console.error("Error generating image:", error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError(
            "Request timed out. The server might be busy. Please try again later."
          );
        } else {
          setError(error.message);
        }
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

    const handleGenerate = async () => {
      if (!prompt) {
        setError("Please enter a prompt before generating an image.");
        return;
      }

      setIsGenerating(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, model: selectedModel }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let data;
        const textResponse = await response.text();
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", textResponse);
          throw new Error(
            `Invalid JSON response: ${textResponse.slice(0, 100)}...`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error || `HTTP error! status: ${response.status}`
          );
        }

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
        setPrompt(""); // Clear the prompt after successful generation
      } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            setError(
              "Request timed out. The server might be busy. Please try again later."
            );
          } else {
            setError(error.message);
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsGenerating(false);
      }
    };
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <AppNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            SolidART.
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
              className="w-full bg-gray-700 text-white rounded-full py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="appearance-none bg-gray-700 text-white rounded-md py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
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
              disabled={isGenerating}
              className={`${
                isGenerating
                  ? "bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded-full text-sm flex-1 sm:flex-none transition duration-150 ease-in-out`}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* History Section */}
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* Increased max-width */}
          <h2 className="text-white text-2xl font-bold mb-4">
            Your Generated Images 👇
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {/* Adjusted grid and gap */}
            {history.map((item, idx) => (
              <BlurFade key={item.id} delay={0.25 + idx * 0.05}>
                <div className="relative group bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-64 sm:h-72 md:h-80 object-cover"
                    src={item.imageUrl}
                    alt={item.prompt}
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() =>
                        handleDownload(item.imageUrl, `image-${item.id}.jpg`)
                      }
                      className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                    >
                      <DownloadIcon size={24} /> {/* Increased icon size */}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm truncate mb-1">
                      {item.prompt}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationInterface;
