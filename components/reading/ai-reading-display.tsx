"use client";

import { useState, useCallback } from "react";
import { DaimoPayButton } from "@daimo/pay";
import { sdk } from "@/lib/farcaster/sdk";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { useToast } from "@/components/ui";

// USDC on Base
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_CHAIN_ID = 8453;

// Treasury address for receiving AI reading payments
const TREASURY_ADDRESS = "0x626522B58b92dAF53596F1378bd25B7653c1fC49";

interface AiReadingDisplayProps {
  roll: AstrodiceRoll;
  question: string;
  readingId: number | null;
  onReadingComplete?: (reading: string) => void;
}

export function AiReadingDisplay({
  roll: _roll,
  question: _question,
  readingId,
  onReadingComplete,
}: AiReadingDisplayProps) {
  // Note: roll and question passed for potential future use (e.g., display in UI)
  void _roll;
  void _question;
  const [aiReading, setAiReading] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const hasReading = !!aiReading;

  const generateReading = useCallback(async () => {
    if (!readingId) {
      setError("Reading not saved yet. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiReading("");

    try {
      const baseUrl = window.location.origin;

      // Get auth token
      let authHeader = "";
      try {
        const { token } = await sdk.quickAuth.getToken();
        authHeader = `Bearer ${token}`;
      } catch {
        throw new Error("Authentication required");
      }

      // Use /api/ai/reading which saves to database
      const response = await fetch(`${baseUrl}/api/ai/reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify({ readingId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get reading");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setAiReading(fullText);
      }

      onReadingComplete?.(fullText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get reading");
      showToast("Failed to generate reading", "error");
    } finally {
      setIsLoading(false);
    }
  }, [readingId, onReadingComplete, showToast]);

  const handlePaymentCompleted = useCallback(() => {
    setIsPaid(true);
    showToast("Payment successful! Generating reading...", "success");
    generateReading();
  }, [generateReading, showToast]);

  // If no reading yet and not loading, show the payment button
  if (!hasReading && !isLoading && !isPaid) {
    return (
      <div className="space-y-3">
        <DaimoPayButton.Custom
          appId="pay-demo"
          toAddress={TREASURY_ADDRESS}
          toChain={BASE_CHAIN_ID}
          toToken={USDC_BASE}
          toUnits="2.00"
          intent="AI Reading"
          onPaymentCompleted={handlePaymentCompleted}
        >
          {({ show }) => (
            <button
              onClick={show}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="mr-2">&#x2728;</span>
              Get AI Reading · $2
            </button>
          )}
        </DaimoPayButton.Custom>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    );
  }

  // Show loading or reading
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">&#x2728;</span>
          <span className="text-sm font-medium text-purple-400">
            AI Interpretation
          </span>
          {isLoading && (
            <span className="text-xs text-white/40 animate-pulse">
              Channeling the cosmos...
            </span>
          )}
        </div>

        <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
          {aiReading || (
            <span className="text-white/40 animate-pulse">
              Consulting the stars...
            </span>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}
