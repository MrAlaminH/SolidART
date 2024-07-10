import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicator = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
          <span className="text-white text-lg font-semibold">
            Generating Image...
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-white mt-2">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
