"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { MAX_FREE_COUNTS } from "@/constants";

export default function CreditScale() {
  const [apiLimitCount, setApiLimitCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApiLimit = async () => {
      try {
        const response = await fetch("/api/user/credit-count");
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setApiLimitCount(data.count);
        }
      } catch (err) {
        console.error("Error fetching API limit:", err);
        setError("Failed to load credit information");
      }
    };
    fetchApiLimit();
  }, []);

  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  if (error) {
    return <Card className="w-64 bg-black text-white p-4">Error: {error}</Card>;
  }

  if (apiLimitCount === null) {
    return <Card className="w-64 bg-black text-white p-4">Loading...</Card>;
  }

  const creditsLeft = MAX_FREE_COUNTS - apiLimitCount;
  const scaleWidth = (creditsLeft / MAX_FREE_COUNTS) * 100;

  return (
    <Card className="w-64 bg-black text-white p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Free Plan</span>
        <span className="text-sm font-medium">
          <Zap className="w-4 h-4 inline-block mr-1" />
          {creditsLeft}/{MAX_FREE_COUNTS} credits left
        </span>
      </div>
      <div className="w-full bg-gray-700 h-2 mb-4 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${scaleWidth}%` }}
        />
      </div>
      <Button
        onClick={handleUpgradeClick}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none"
      >
        <Zap className="w-4 h-4 mr-2" />
        Upgrade Plan
      </Button>
    </Card>
  );
}
