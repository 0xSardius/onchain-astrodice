"use client";

import { useAccount } from "wagmi";

export function Header() {
  const { address, isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">&#x2728;</span>
          <h1 className="text-lg font-semibold text-white">Astrodice</h1>
        </div>

        {isConnected && address && (
          <div className="text-xs text-white/60 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
    </header>
  );
}
