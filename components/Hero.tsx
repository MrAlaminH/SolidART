"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  const handleGenerate = () => {
    router.push("/auth/register");
  };

  return (
    <div className=" bg-transparent text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="inline-block px-2 py-2 bg-fuchsia-500 text-white text-xs sm:text-xs md:text-md font-semibold rounded-full border-2 border-white shadow-md">
          🎉 Next Generation Tool
        </p>
        {/* H1 Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
          Unlock <span className="text-fuchsia-500">Creativity</span> with
          <br />
          <span className="text-fuchsia-500">AI-Powered</span> Image Generate
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl md:max-w-2xl mx-auto">
          Revolutionize your design process with our AI image generator. Say
          goodbye to stock photos and hello to endless possibilities.
        </p>
        <div className="flex w-full max-w-md mx-auto">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your idea"
            className="flex-grow px-4 sm:px-6 py-2 sm:py-3 rounded-l-full bg-gray-900 border-2 border-gray-700 focus:outline-none focus:border-fuchsia-500 text-sm sm:text-lg"
          />
          <button
            onClick={handleGenerate}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-fuchsia-600 rounded-r-full font-medium flex items-center hover:bg-fuchsia-700 transition-colors text-sm sm:text-lg"
          >
            <Sparkles className="mr-1 sm:mr-2" size={20} />
            Generate
          </button>
        </div>
      </div>
      <div className="mt-10 md:mt-20 flex justify-center items-end space-x-4 sm:space-x-6">
        {/* Image 1 */}
        <div className="w-28 h-36 sm:w-40 sm:h-48 md:w-64 md:h-72 lg:w-72 lg:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo3.png"
            alt="AI generated image 1"
            width={288}
            height={320}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Image 2 */}
        <div className="w-32 h-40 sm:w-44 sm:h-52 md:w-72 md:h-80 lg:w-80 lg:h-96 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo2.png"
            alt="AI generated image 2"
            width={320}
            height={384}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Image 3 */}
        <div className="w-28 h-36 sm:w-40 sm:h-48 md:w-64 md:h-72 lg:w-72 lg:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo1.png"
            alt="AI generated image 3"
            width={288}
            height={320}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
