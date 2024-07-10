// import React from "react";
// import AppNavbar from "@/components/AppNavbar";

// const page = () => {
//   return (
//     <>
//       <AppNavbar />
//       <div className="w-full max-w-4xl">
//         <h2 className="text-white text-2xl font-bold mb-4 text-center py-8">
//           Loved Images
//         </h2>
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {history.map((item) => (
//           <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
//             <img
//               src={item.imageUrl}
//               alt={item.prompt}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <p className="text-white text-sm truncate">{item.prompt}</p>
//               <p className="text-gray-400 text-xs mt-1">
//                 {item.timestamp.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div> */}
//       </div>
//     </>
//   );
// };

// export default page;

"use client";
import React, { useState, useEffect } from "react";
import { HeartIcon, DownloadIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import AppNavbar from "@/components/AppNavbar";
import {
  getLovedImages,
  removeLovedImage,
  LovedImage,
} from "@/utils/lovedImages";

const LovedPage: React.FC = () => {
  const [lovedImages, setLovedImages] = useState<LovedImage[]>([]);

  useEffect(() => {
    setLovedImages(getLovedImages());
  }, []);

  const handleUnlove = (id: number) => {
    removeLovedImage(id);
    setLovedImages((prevImages) => prevImages.filter((img) => img.id !== id));
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

  return (
    <section id="loved-photos">
      <AppNavbar />
      <div className="py-6">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Your Loved Images
        </h1>
        <div className="columns-2 gap-4 sm:columns-3 px-4">
          {lovedImages.map((image, idx) => (
            <BlurFade key={image.id} delay={0.25 + idx * 0.05} inView>
              <div className="relative mb-4 group">
                <img
                  className="w-full rounded-lg object-contain"
                  src={image.url}
                  alt={`Loved image ${image.id}`}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleUnlove(image.id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                  >
                    <HeartIcon size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(image.url, `loved-image-${image.id}.jpg`)
                    }
                    className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <DownloadIcon size={20} />
                  </button>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LovedPage;
