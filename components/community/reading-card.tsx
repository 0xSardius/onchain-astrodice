"use client";

import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";
import type { Planet, Sign, House } from "@/lib/astrodice";

export interface CommunityReadingData {
  id: number;
  userFid: number;
  username: string;
  displayName: string;
  pfpUrl: string | null;
  question: string;
  planet: string;
  sign: string;
  house: number;
  isMinted: boolean;
  createdAt: string;
}

interface ReadingCardProps {
  reading: CommunityReadingData;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ReadingCard({ reading }: ReadingCardProps) {
  const planet = getPlanetInfo(reading.planet as Planet);
  const sign = getSignInfo(reading.sign as Sign);
  const house = getHouseInfo(reading.house as House);

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-3">
      {/* User header */}
      <div className="flex items-center gap-3">
        {reading.pfpUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={reading.pfpUrl}
            alt={reading.username}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-sm">&#x1F464;</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {reading.displayName}
          </p>
          <p className="text-xs text-white/50">
            @{reading.username} · {formatTimeAgo(reading.createdAt)}
          </p>
        </div>
        {reading.isMinted && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            NFT
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm text-white/70 italic line-clamp-2">
        &ldquo;{reading.question}&rdquo;
      </p>

      {/* Roll result */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-lg">
          <span title={planet.name}>{planet.symbol}</span>
          <span className="text-white/30 text-sm">·</span>
          <span title={sign.name}>{sign.symbol}</span>
          <span className="text-white/30 text-sm">·</span>
          <span className="font-serif" title={`${house.number}th House`}>
            {house.number}
          </span>
        </div>
        <div className="text-xs text-white/50 text-right">
          <span className="text-amber-300">{planet.name}</span>
          {" in "}
          <span className="text-purple-300">{sign.name}</span>
          <br />
          <span className="text-blue-300">{house.name}</span>
        </div>
      </div>
    </div>
  );
}
