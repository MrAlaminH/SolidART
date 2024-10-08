"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UpgradeProProps {
  onClose: () => void;
}

const UpgradePro: React.FC<UpgradeProProps> = ({ onClose }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/pricing");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Upgrade Your Plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Youve reached the limit of your free plan. Upgrade now to continue
          using our API and unlock more features!
        </p>
        <div className="flex justify-between">
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            Upgrade Plan
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePro;
