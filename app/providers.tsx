"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { DaimoPayProvider } from "@daimo/pay";
import { useState, type ReactNode } from "react";
import { config } from "@/lib/wagmi/config";
import { ToastProvider, ErrorBoundary } from "@/components/ui";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DaimoPayProvider>
            <ToastProvider>{children}</ToastProvider>
          </DaimoPayProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
