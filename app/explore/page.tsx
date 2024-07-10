// // app/explore/page.tsx
// "use client";
// import { Heart, Download } from "lucide-react";
// import AppNavbar from "@/components/AppNavbar";

// const images = [
//   {
//     src: "https://images.unsplash.com/photo-1574774191469-3d7732e5fc8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 1",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1420745981456-b95fe23f5753?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 2",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1574774191469-3d7732e5fc8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 3",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1578645635737-6a88e706e0f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 4",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1420745981456-b95fe23f5753?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 5",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1574774191469-3d7732e5fc8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
//     alt: "Random Image 6",
//   },
// ];

// const explore = () => {
//   return (
//     <div className="text-white text-2xl font-bold mb-4 text-center ">
//       <AppNavbar />
//       <h1 className="py-4">All the trending generated images</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//         {images.map((image, index) => (
//           <div key={index} className="relative group">
//             <img
//               src={image.src}
//               alt={image.alt}
//               className="w-full h-auto rounded-lg"
//             />
//             <div className="absolute top-0 right-0 p-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button className="focus:outline-none">
//                 <Heart className="w-6 h-6 text-white" />
//               </button>
//               <button className="focus:outline-none">
//                 <Download className="w-6 h-6 text-white" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default explore;

// import BlurFade from "@/components/magicui/blur-fade";
// import AppNavbar from "@/components/AppNavbar";

// console.log(BlurFade); // Should log the component function or class

// const images = Array.from({ length: 20 }, (_, i) => {
//   const isLandscape = i % 2 === 0;
//   const width = isLandscape ? 800 : 600;
//   const height = isLandscape ? 600 : 800;
//   return `https://picsum.photos/seed/${i + 1}/${width}/${height}`;
// });

// const explore = () => {
//   return (
//     <section id="photos">
//       <AppNavbar />
//       <div className="py-6">
//         <h1 className="text-white text-2xl font-bold mb-6 text-center">
//           All the trending generated images
//         </h1>
//         <div className="columns-2 gap-4 sm:columns-3 px-4">
//           {images.map((imageUrl, idx) => (
//             <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
//               <img
//                 className="mb-4 size-full rounded-lg object-contain"
//                 src={imageUrl}
//                 alt={`Random stock image ${idx + 1}`}
//               />
//             </BlurFade>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default explore;

"use client";
import React, { useState } from "react";
import { HeartIcon, DownloadIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import AppNavbar from "@/components/AppNavbar";
import { saveLovedImage, removeLovedImage } from "@/utils/lovedImages";

interface Image {
  id: number;
  url: string;
  isLoved: boolean;
}

const ExplorePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/seed/${i + 1}/${i % 2 === 0 ? 800 : 600}/${
        i % 2 === 0 ? 600 : 800
      }`,
      isLoved: false,
    }))
  );

  const handleLove = (id: number) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id === id) {
          const newIsLoved = !img.isLoved;
          if (newIsLoved) {
            saveLovedImage(
              img.id.toString(), // Convert id to string if necessary
              img.url,
              {
                id: img.id,
                url: img.url,
                timestamp: new Date().toISOString(),
              }
            );
          } else {
            removeLovedImage(img.id);
          }
          return { ...img, isLoved: newIsLoved };
        }
        return img;
      })
    );
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
    <section id="photos">
      <AppNavbar />
      <div className="py-6">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          All the trending generated images
        </h1>
        <div className="columns-2 gap-4 sm:columns-3 px-4">
          {images.map((image, idx) => (
            <BlurFade key={image.id} delay={0.25 + idx * 0.05} inView>
              <div className="relative mb-4 group">
                <img
                  className="w-full rounded-lg object-contain"
                  src={image.url}
                  alt={`Random stock image ${image.id}`}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleLove(image.id)}
                    className={`p-2 rounded-full ${
                      image.isLoved ? "bg-red-500" : "bg-white"
                    } text-gray-800  transition-colors duration-300`}
                  >
                    <HeartIcon size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(image.url, `image-${image.id}.jpg`)
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

export default ExplorePage;
