"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sdk } from "@/lib/farcaster/sdk";
import { CollectionGrid, type CollectionReading } from "@/components/collection";

export default function CollectionPage() {
  const [readings, setReadings] = useState<CollectionReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const username = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "anon";

  useEffect(() => {
    async function fetchCollection() {
      try {
        setIsLoading(true);
        setError(null);

        // Get auth token from Farcaster
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

        const response = await fetch("/api/collection", {
          headers: {
            Authorization: authHeader,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch collection");
        }

        const data = await response.json();
        setReadings(data.readings || []);
      } catch (err) {
        console.error("Collection fetch error:", err);
        setError("Unable to load your collection. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollection();
  }, []);

  return (
    <div className="min-h-[calc(100vh-9rem)] px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">Your Collection</h1>
          <p className="text-white/50 text-sm">
            Readings you&apos;ve minted as NFTs on Base
          </p>
        </div>

        {/* Stats */}
        {!isLoading && !error && readings.length > 0 && (
          <div className="flex justify-center gap-6 text-center">
            <div>
              <p className="text-2xl font-semibold text-white">
                {readings.length}
              </p>
              <p className="text-xs text-white/50">
                {readings.length === 1 ? "Reading" : "Readings"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-purple-400">
                {readings.filter((r) => r.aiReading).length}
              </p>
              <p className="text-xs text-white/50">With AI</p>
            </div>
          </div>
        )}

        {/* Grid */}
        <CollectionGrid
          readings={readings}
          username={username}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
