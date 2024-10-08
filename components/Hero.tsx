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
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Unlock <span className="text-fuchsia-500">Creativity</span> with
          <br />
          <span className="text-fuchsia-500">AI-Powered</span> Image Generate
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Revolutionize your design process with our AI image generator. Say
          goodbye to stock photos and hello to endless possibilities.
        </p>
        <div className="flex w-full max-w-md mx-auto">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your idea"
            className="flex-grow px-6 py-3 rounded-l-full bg-gray-900 border-2 border-gray-700 focus:outline-none focus:border-fuchsia-500 text-lg"
          />
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-fuchsia-600 rounded-r-full font-medium flex items-center hover:bg-fuchsia-700 transition-colors text-lg"
          >
            <Sparkles className="mr-2" size={24} />
            Generate
          </button>
        </div>
      </div>
      <div className="mt-20 flex justify-center items-end space-x-6">
        <div className="w-48 h-56 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo3.png"
            alt="AI generated image 1"
            width={192}
            height={224}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-56 h-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo2.png"
            alt="AI generated image 2"
            width={224}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-48 h-56 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/demo1.png"
            alt="AI generated image 3"
            width={192}
            height={224}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
