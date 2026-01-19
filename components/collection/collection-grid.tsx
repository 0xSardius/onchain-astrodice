"use client";

import { CollectionCard, type CollectionReading } from "./collection-card";

interface CollectionGridProps {
  readings: CollectionReading[];
  username: string;
  isLoading?: boolean;
  error?: string | null;
}

export function CollectionGrid({
  readings,
  username,
  isLoading,
  error,
}: CollectionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl border border-white/10 overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-white/10" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-white/10 rounded w-20" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">&#x2728;</div>
        <h3 className="text-white font-medium mb-1">No minted readings yet</h3>
        <p className="text-white/50 text-sm">
          When you mint a reading as an NFT, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {readings.map((reading) => (
        <CollectionCard
          key={reading.id}
          reading={reading}
          username={username}
        />
      ))}
    </div>
  );
}
