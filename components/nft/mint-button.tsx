"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { NftPreview } from "./nft-preview";
import type { MintStatus } from "@/types/nft";

// Minimal ERC721 ABI for minting with URI
const NFT_ABI = [
  {
    name: "mintTo",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
] as const;

interface MintButtonProps {
  readingId: number;
  roll: AstrodiceRoll;
  question: string;
  username: string;
  hasAiReading: boolean;
  disabled?: boolean;
  onMintSuccess?: (tokenId: number, txHash: string) => void;
}

export function MintButton({
  readingId,
  roll,
  question,
  username,
  hasAiReading,
  disabled = false,
  onMintSuccess,
}: MintButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setMintStatus("error");
      setError(writeError.message || "Transaction failed");
    }
  }, [writeError]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash && mintStatus !== "success") {
      setMintStatus("success");
      setShowPreview(false);

      // Update database with mint info
      fetch("/api/mint", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          readingId,
          tokenId: 0, // Would need to parse from tx receipt in production
          txHash,
        }),
      }).catch(console.error);

      onMintSuccess?.(0, txHash);
    }
  }, [isConfirmed, txHash, mintStatus, readingId, onMintSuccess]);

  const handleOpenPreview = () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    setShowPreview(true);
    setError(null);
    resetWrite();
  };

  const handleMint = async () => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    setMintStatus("preparing");
    setError(null);

    try {
      // 1. Call API to prepare metadata and upload to IPFS
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          readingId,
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to prepare mint");
      }

      const { mintParams, contractAddress } = await response.json();

      // 2. Execute mint transaction
      setMintStatus("confirming");

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: "mintTo",
        args: [mintParams.to as `0x${string}`, mintParams.uri],
      });
    } catch (err) {
      setMintStatus("error");
      setError(err instanceof Error ? err.message : "Mint failed");
    }
  };

  const handleClose = () => {
    if (!isMinting) {
      setShowPreview(false);
      setError(null);
      setMintStatus("idle");
      resetWrite();
    }
  };

  const isMinting = mintStatus === "preparing" || isPending || isConfirming;

  return (
    <>
      <button
        onClick={handleOpenPreview}
        disabled={disabled || !isConnected || mintStatus === "success"}
        className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mintStatus === "success" ? (
          <span className="text-green-400">Minted!</span>
        ) : (
          "Mint Reading"
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center mt-2">{error}</p>
      )}

      <NftPreview
        roll={roll}
        question={question}
        username={username}
        hasAiReading={hasAiReading}
        onMint={handleMint}
        onClose={handleClose}
        isOpen={showPreview}
        isMinting={isMinting}
      />
    </>
  );
}
