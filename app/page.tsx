"use client";

import { useState, useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { sdk } from "@/lib/farcaster/sdk";
import { rollAstrodice, type AstrodiceRoll } from "@/lib/astrodice";
import { DiceAnimation } from "@/components/dice/dice-animation";
import { DiceResult } from "@/components/dice/dice-result";
import { InterpretationGuide } from "@/components/reading/interpretation-guide";
import { AiReadingDisplay } from "@/components/reading/ai-reading-display";
import { MintButton } from "@/components/nft";
import { ShareButton } from "@/components/share";
import { HowItWorksModal } from "@/components/ui";

type ViewState = "input" | "rolling" | "result";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("input");
  const [currentRoll, setCurrentRoll] = useState<AstrodiceRoll | null>(null);
  const [savedQuestion, setSavedQuestion] = useState("");
  const [readingId, setReadingId] = useState<number | null>(null);
  const [hasAiReading, setHasAiReading] = useState(false);

  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();

  // Initialize Farcaster SDK and auto-connect wallet
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        if (!isConnected && connectors.length > 0) {
          connect({ connector: connectors[0] });
        }
        setIsReady(true);
      } catch {
        console.log("Not in Farcaster miniapp context");
        setIsReady(true);
      }
    };
    init();
  }, [connect, connectors, isConnected]);

  const handleRoll = async () => {
    if (!question.trim()) return;

    // Save question and start rolling
    const trimmedQuestion = question.trim();
    setSavedQuestion(trimmedQuestion);
    setViewState("rolling");

    // After animation, show result
    setTimeout(async () => {
      const roll = rollAstrodice();
      setCurrentRoll(roll);
      setViewState("result");

      // Save reading to database (fire and forget - don't block UI)
      try {
        const baseUrl = window.location.origin;

        // Get auth token from Farcaster SDK
        let authHeader = "";
        try {
          const { token } = await sdk.quickAuth.getToken();
          authHeader = `Bearer ${token}`;
        } catch (authErr) {
          console.error("Failed to get auth token:", authErr);
        }

        const response = await fetch(`${baseUrl}/api/readings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader && { Authorization: authHeader }),
          },
          body: JSON.stringify({
            question: trimmedQuestion,
            planet: roll.planet,
            sign: roll.sign,
            house: roll.house,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setReadingId(data.reading.id);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to save reading:", response.status, errorData);
        }
      } catch (err) {
        console.error("Failed to save reading:", err);
      }
    }, 2500);
  };

  const handleAskAgain = () => {
    setQuestion("");
    setCurrentRoll(null);
    setSavedQuestion("");
    setReadingId(null);
    setHasAiReading(false);
    setViewState("input");
  };

  // Input view
  if (viewState === "input") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-9rem)] px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-3">
            <div className="text-5xl mb-4">&#x1F52E;</div>
            <h2 className="text-2xl font-semibold text-white">
              What question do you bring to the stars?
            </h2>
            <p className="text-white/60 text-sm">
              The cosmic dice will reveal Planet, Sign, and House to illuminate
              your path.
            </p>
          </div>

          <div className="space-y-1">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about love, career, decisions, or whatever weighs on your heart..."
              className="w-full h-28 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
              maxLength={280}
            />
            <div className="text-xs text-white/40 text-right">
              {question.length}/280
            </div>
          </div>

          <button
            onClick={handleRoll}
            disabled={!question.trim() || !isReady}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="mr-2">&#x2728;</span>
            Cast the Dice
          </button>

          <div className="space-y-2">
            <p className="text-xs text-white/40">
              Free roll includes Planet + Sign + House with keywords.
              <br />
              AI-powered interpretation available for $2.
            </p>
            <HowItWorksModal />
          </div>
        </div>
      </div>
    );
  }

  // Rolling animation view
  if (viewState === "rolling") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-9rem)] px-4">
        <DiceAnimation isRolling={true} />
      </div>
    );
  }

  // Result view
  if (viewState === "result" && currentRoll) {
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-9rem)] px-4 py-6">
        <div className="w-full max-w-md space-y-6">
          <DiceResult roll={currentRoll} question={savedQuestion} />

          <InterpretationGuide roll={currentRoll} />

          {/* AI Reading */}
          <AiReadingDisplay
            roll={currentRoll}
            question={savedQuestion}
            readingId={readingId}
            onReadingComplete={() => setHasAiReading(true)}
          />

          {/* Secondary CTAs */}
          <div className="flex gap-3">
            {readingId ? (
              <MintButton
                readingId={readingId}
                roll={currentRoll}
                question={savedQuestion}
                username={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "anon"}
                hasAiReading={hasAiReading}
                disabled={!isConnected}
              />
            ) : (
              <button
                disabled
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed"
              >
                Saving...
              </button>
            )}
            <button
              onClick={handleAskAgain}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors"
            >
              <span className="mr-1">&#x1F504;</span> Ask Again
            </button>
          </div>

          {/* Share to Farcaster */}
          <ShareButton
            roll={currentRoll}
            question={savedQuestion}
            readingId={readingId ?? undefined}
            className="w-full"
          />

          <p className="text-xs text-white/40 text-center">
            {isConnected
              ? "Mint your reading as an NFT on Base (gas only ~$0.01)"
              : "Connect wallet in Farcaster to mint"}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
