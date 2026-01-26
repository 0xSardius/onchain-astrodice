"use client";

import { useState, useCallback } from "react";
import { DaimoPayButton } from "@daimo/pay";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { useToast } from "@/components/ui";

// USDC on Base
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_CHAIN_ID = 8453;

// TODO: Replace with your treasury address
const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000000";

interface AiReadingDisplayProps {
  roll: AstrodiceRoll;
  question: string;
  onReadingComplete?: (reading: string) => void;
}

export function AiReadingDisplay({
  roll,
  question,
  onReadingComplete,
}: AiReadingDisplayProps) {
  const [aiReading, setAiReading] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const hasReading = !!aiReading;

  const generateReading = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAiReading("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          planet: roll.planet,
          sign: roll.sign,
          house: roll.house,
        }),
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
  }, [question, roll, onReadingComplete, showToast]);

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
