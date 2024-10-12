"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  const handleGenerate = () => {
    router.push("/auth/register");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="bg-transparent text-white flex flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto text-center space-y-4 mt-14 md:mt-2">
        <motion.p
          className="inline-block px-2 py-2 bg-fuchsia-500 text-white text-xs sm:text-sm md:text-base font-semibold rounded-full border-2 border-white shadow-md"
          variants={itemVariants}
        >
          🎉 Next Generation Tool
        </motion.p>
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-gray-900 dark:text-white"
          variants={itemVariants}
        >
          Unlock <span className="text-fuchsia-500">Creativity</span> with
          <br />
          <span className="text-fuchsia-500">AI-Powered</span> Image Generate
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-900 dark:text-gray-300 max-w-xl md:max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Revolutionize your design process with our AI image generator. Say
          goodbye to stock photos and hello to endless possibilities.
        </motion.p>
        <motion.div
          className="flex w-full max-w-md mx-auto"
          variants={itemVariants}
        >
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your idea"
            className="flex-grow px-4 sm:px-6 py-2 sm:py-3 rounded-l-full bg-gray-900 border-2 border-gray-700 focus:outline-none focus:border-fuchsia-500 text-sm sm:text-base"
          />
          <motion.button
            onClick={handleGenerate}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-fuchsia-600 rounded-r-full font-medium flex items-center hover:bg-fuchsia-700 transition-colors text-sm sm:text-base"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Sparkles className="mr-1 sm:mr-2" size={20} />
            Generate
          </motion.button>
        </motion.div>
      </div>
      <motion.div
        className="mt-10 md:mt-20 flex justify-center items-end space-x-4 sm:space-x-6"
        variants={containerVariants}
      >
        {[
          {
            src: "/demo3.png",
            alt: "AI generated image 1",
            size: "w-28 h-36 sm:w-40 sm:h-48 md:w-64 md:h-72 lg:w-72 lg:h-80",
          },
          {
            src: "/demo2.png",
            alt: "AI generated image 2",
            size: "w-32 h-40 sm:w-44 sm:h-52 md:w-72 md:h-80 lg:w-80 lg:h-96",
          },
          {
            src: "/demo1.png",
            alt: "AI generated image 3",
            size: "w-28 h-36 sm:w-40 sm:h-48 md:w-64 md:h-72 lg:w-72 lg:h-80",
          },
        ].map((image, index) => (
          <motion.div
            key={index}
            className={`${image.size} bg-gray-800 rounded-lg overflow-hidden shadow-lg relative`}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.div variants={imageVariants} className="w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
