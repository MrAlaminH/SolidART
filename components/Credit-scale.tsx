"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { MAX_FREE_COUNTS } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreditScale() {
  const [apiLimitCount, setApiLimitCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Retrieve cached data from localStorage or initialize with the maximum count.
  useEffect(() => {
    const cachedCount = localStorage.getItem("apiLimitCount");
    if (cachedCount) {
      setApiLimitCount(Number(cachedCount)); // Show cached data first
    }

    // Fetch updated data from the server in the background
    const fetchApiLimit = async () => {
      try {
        const response = await fetch("/api/user/credit-count");
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setApiLimitCount(data.count);
          localStorage.setItem("apiLimitCount", data.count); // Update cached data
        }
      } catch (err) {
        console.error("Error fetching API limit:", err);
        setError("Failed to load credit information");
      }
    };

    fetchApiLimit(); // Fetch data from server
  }, []);

  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  // Calculate credits left based on the stored/cached or fetched count
  const creditsLeft =
    apiLimitCount !== null ? MAX_FREE_COUNTS - apiLimitCount : MAX_FREE_COUNTS;
  const scaleWidth = (creditsLeft / MAX_FREE_COUNTS) * 100;

  return (
    <Card className="w-64 bg-black/20 text-white p-4">
      {error ? (
        <div>Error: {error}</div>
      ) : apiLimitCount === null ? (
        <>
          <Skeleton className="w-full h-4 mb-2 bg-gray-700" />
          <Skeleton className="w-full h-2 mb-4 bg-gray-700" />
          <Skeleton className="w-full h-10 bg-gray-700" />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Free Plan</span>
            <span className="text-sm font-medium">
              <Zap className="w-4 h-4 inline-block mr-1" />
              {creditsLeft}/{MAX_FREE_COUNTS} credits left
            </span>
          </div>
          <div className="w-full h-2 mb-4 rounded-full overflow-hidden">
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
        </>
      )}
    </Card>
  );
}
