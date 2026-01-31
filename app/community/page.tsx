"use client";

import { useState, useEffect } from "react";
import { sdk } from "@/lib/farcaster/sdk";
import { ReadingFeed, type CommunityReadingData } from "@/components/community";

export default function CommunityPage() {
  const [readings, setReadings] = useState<CommunityReadingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunityFeed() {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = window.location.origin;

        // Get auth token
        let authHeader = "";
        try {
          const { token } = await sdk.quickAuth.getToken();
          authHeader = `Bearer ${token}`;
        } catch {
          // Not in Farcaster context - show empty state
          setReadings([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/api/community?limit=50`, {
          headers: {
            ...(authHeader && { Authorization: authHeader }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch community feed");
        }

        const data = await response.json();
        setReadings(data.readings || []);
      } catch (err) {
        console.error("Community feed error:", err);
        setReadings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommunityFeed();
  }, []);

  return (
    <div className="min-h-[calc(100vh-9rem)] px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">Community</h1>
          <p className="text-white/50 text-sm">
            Minted readings from people you follow
          </p>
        </div>

        {/* Feed */}
        <ReadingFeed
          readings={readings}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
