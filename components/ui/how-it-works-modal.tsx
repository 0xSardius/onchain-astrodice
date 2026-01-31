"use client";

import { useState } from "react";

export function HowItWorksModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-white/50 text-sm hover:text-white/80 transition-colors underline underline-offset-2"
      >
        How it works
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6 space-y-5">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          &#x2715;
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-3xl">&#x1F3B2;</div>
          <h2 className="text-xl font-semibold text-white">How Astrodice Works</h2>
        </div>

        {/* The System */}
        <div className="space-y-3">
          <p className="text-white/70 text-sm">
            Astrodice is a divination system using three cosmic dice, creating{" "}
            <span className="text-purple-400">1,728 unique combinations</span>.
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-lg">&#x2609;</span>
              <div>
                <p className="text-white font-medium text-sm">Planet</p>
                <p className="text-white/50 text-xs">What energy is at play</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-lg">&#x2648;</span>
              <div>
                <p className="text-white font-medium text-sm">Sign</p>
                <p className="text-white/50 text-xs">How it manifests</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-lg">&#x2302;</span>
              <div>
                <p className="text-white font-medium text-sm">House</p>
                <p className="text-white/50 text-xs">Where in your life</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="text-white font-medium text-sm">Your Journey</h3>
          <ol className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2">
              <span className="text-purple-400">1.</span>
              Ask a question that weighs on your heart
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">2.</span>
              Cast the dice and receive your cosmic result
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">3.</span>
              Get an AI interpretation for deeper insight ($2)
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400">4.</span>
              Mint your reading as an NFT on Base
            </li>
          </ol>
        </div>

        {/* Pricing */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          <h3 className="text-white font-medium text-sm">Pricing</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white">Free Roll</p>
              <p className="text-white/50">Result + keywords</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 border border-purple-500/30">
              <p className="text-purple-300">AI Reading</p>
              <p className="text-white/50">$2 · 250 words</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white">Mint NFT</p>
              <p className="text-white/50">Gas only (~$0.01)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <p className="text-white">Extended</p>
              <p className="text-white/50">+$1 · deeper dive</p>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Got it, let&apos;s begin
        </button>
      </div>
    </div>
  );
}
