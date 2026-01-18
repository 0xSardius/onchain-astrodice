"use client";

import { ReadingCard, type CommunityReadingData } from "./reading-card";

interface ReadingFeedProps {
  readings: CommunityReadingData[];
  isLoading?: boolean;
  error?: string | null;
}

export function ReadingFeed({ readings, isLoading, error }: ReadingFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl border border-white/10 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-3 bg-white/10 rounded w-32" />
              </div>
            </div>
            <div className="h-4 bg-white/10 rounded w-full mb-3" />
            <div className="h-12 bg-white/10 rounded" />
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
        <div className="text-4xl mb-3">&#x1F30C;</div>
        <h3 className="text-white font-medium mb-1">No readings yet</h3>
        <p className="text-white/50 text-sm">
          When people you follow mint their readings, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {readings.map((reading) => (
        <ReadingCard key={reading.id} reading={reading} />
      ))}
    </div>
  );
}
