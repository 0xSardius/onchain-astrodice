"use client";

import type { AstrodiceRoll } from "@/lib/astrodice";
import { NftVisual } from "./nft-visual";

interface NftPreviewProps {
  roll: AstrodiceRoll;
  question: string;
  username: string;
  hasAiReading: boolean;
  onMint: () => void;
  onClose: () => void;
  isOpen: boolean;
  isMinting: boolean;
}

export function NftPreview({
  roll,
  question,
  username,
  hasAiReading,
  onMint,
  onClose,
  isOpen,
  isMinting,
}: NftPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Mint Your Reading</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
            disabled={isMinting}
          >
            &times;
          </button>
        </div>

        {/* NFT Preview */}
        <div className="rounded-xl overflow-hidden border border-white/10">
          <NftVisual
            roll={roll}
            question={question}
            username={username}
            timestamp={new Date()}
            hasAiReading={hasAiReading}
          />
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-white/60">
          <p>
            Your reading will be minted as an NFT on Base. Gas cost is
            approximately $0.01-0.05.
          </p>
          {hasAiReading && (
            <p className="text-purple-400">
              Includes AI interpretation (ornate typography)
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
            disabled={isMinting}
          >
            Cancel
          </button>
          <button
            onClick={onMint}
            disabled={isMinting}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <span className="animate-pulse">Minting...</span>
            ) : (
              "Confirm Mint"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
