"use client";

import {
  configureChains,
  chain,
  WagmiConfig,
  createClient,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ReactNode, useEffect, useState } from "react";

// Configure chains without WebSocket provider for SSR
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID })]
);

// Create client without WebSocket provider to avoid SSR issues
const client = createClient({
  autoConnect: typeof window !== "undefined",
  provider,
  // Don't include webSocketProvider to avoid SSR WebSocket connection errors
});

interface WagmiProviderProps {
  children: ReactNode;
}

export default function WagmiProvider({ children }: WagmiProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render children without WagmiConfig during SSR to avoid WebSocket errors
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WagmiConfig client={client}>
      {children}
    </WagmiConfig>
  );
}

