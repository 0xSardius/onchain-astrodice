"use client";

import { NftVisual } from "@/components/nft/nft-visual";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";
import type { Planet, Sign, House } from "@/lib/astrodice";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

export interface CollectionReading {
  id: number;
  question: string;
  planet: string;
  sign: string;
  house: number;
  aiReading: string | null;
  tokenId: number | null;
  txHash: string | null;
  createdAt: string;
}

interface CollectionCardProps {
  reading: CollectionReading;
  username: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CollectionCard({ reading, username }: CollectionCardProps) {
  const planet = getPlanetInfo(reading.planet as Planet);
  const sign = getSignInfo(reading.sign as Sign);
  const house = getHouseInfo(reading.house as House);

  const roll = {
    planet: reading.planet as Planet,
    sign: reading.sign as Sign,
    house: reading.house as House,
  };

  const openSeaUrl = NFT_CONTRACT && reading.tokenId !== null
    ? `https://opensea.io/assets/base/${NFT_CONTRACT}/${reading.tokenId}`
    : null;

  const basescanUrl = reading.txHash
    ? `https://basescan.org/tx/${reading.txHash}`
    : null;

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      {/* NFT Visual */}
      <div className="aspect-square">
        <NftVisual
          roll={roll}
          question={reading.question}
          username={username}
          timestamp={new Date(reading.createdAt)}
          hasAiReading={!!reading.aiReading}
          className="w-full h-full"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Roll summary */}
        <div className="flex items-center gap-2 text-lg">
          <span>{planet.symbol}</span>
          <span className="text-white/30 text-sm">·</span>
          <span>{sign.symbol}</span>
          <span className="text-white/30 text-sm">·</span>
          <span className="font-serif">{house.number}</span>
        </div>

        {/* Names */}
        <p className="text-sm text-white/70">
          <span className="text-amber-300">{planet.name}</span>
          {" in "}
          <span className="text-purple-300">{sign.name}</span>
          {" · "}
          <span className="text-blue-300">{house.name}</span>
        </p>

        {/* Question */}
        <p className="text-xs text-white/50 italic line-clamp-2">
          &ldquo;{reading.question}&rdquo;
        </p>

        {/* Date */}
        <p className="text-xs text-white/40">
          {formatDate(reading.createdAt)}
        </p>

        {/* Links */}
        <div className="flex gap-2 pt-2">
          {openSeaUrl && (
            <a
              href={openSeaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs text-center hover:bg-blue-500/20 transition-colors"
            >
              OpenSea
            </a>
          )}
          {basescanUrl && (
            <a
              href={basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs text-center hover:bg-white/10 transition-colors"
            >
              Basescan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
