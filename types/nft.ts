// NFT-related type definitions
import type { AstrodiceRoll } from "@/lib/astrodice";

// Response from /api/mint POST endpoint
export interface MintPrepareResponse {
  success: boolean;
  readingId: number;
  metadataUri: string;
  imageUri: string;
  contractAddress: string;
  mintParams: {
    to: string; // User's wallet address
    uri: string; // Metadata URI
  };
}

// Error response from /api/mint
export interface MintErrorResponse {
  error: string;
  tokenId?: number; // If already minted
}

// Request body for /api/mint POST
export interface MintPrepareRequest {
  readingId: number;
  walletAddress: string;
}

// Request body for /api/mint PATCH (after mint success)
export interface MintConfirmRequest {
  readingId: number;
  tokenId: number;
  txHash: string;
}

// Mint transaction state
export type MintStatus =
  | "idle"
  | "preparing"
  | "confirming"
  | "success"
  | "error";

// Result after successful mint
export interface MintResult {
  tokenId: number;
  txHash: string;
  openSeaUrl: string;
  basescanUrl: string;
}

// Props for NFT visual component
export interface NftVisualProps {
  roll: AstrodiceRoll;
  question: string;
  username: string;
  timestamp: Date;
  hasAiReading: boolean;
  className?: string;
}

// Props for NFT preview modal
export interface NftPreviewProps {
  roll: AstrodiceRoll;
  question: string;
  username: string;
  hasAiReading: boolean;
  onMint: () => void;
  onClose: () => void;
  isOpen: boolean;
  isMinting: boolean;
}

// Props for mint button component
export interface MintButtonProps {
  readingId: number;
  roll: AstrodiceRoll;
  question: string;
  username: string;
  hasAiReading: boolean;
  disabled?: boolean;
  onMintSuccess?: (tokenId: number, txHash: string) => void;
}
