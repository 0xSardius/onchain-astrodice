// Generate NFT metadata and upload to IPFS via Thirdweb
import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { generateNftSvg, type NftVisualConfig } from "./svg";

// NFT metadata conforming to OpenSea standard
export interface NftMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI
  external_url: string;
  attributes: NftAttribute[];
  interpretation?: string; // AI reading if purchased
}

export interface NftAttribute {
  trait_type: string;
  value: string | number;
}

export interface MintReadingParams {
  readingId: number;
  roll: AstrodiceRoll;
  question: string;
  username: string;
  userFid: number;
  timestamp: Date;
  aiReading: string | null;
  extendedReading: string | null;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Initialize Thirdweb client (server-side only)
function getThirdwebClient() {
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  if (!secretKey) {
    throw new Error("THIRDWEB_SECRET_KEY is required for IPFS uploads");
  }
  return createThirdwebClient({ secretKey });
}

// Generate SVG and upload to IPFS
export async function uploadNftImage(
  config: NftVisualConfig
): Promise<string> {
  const client = getThirdwebClient();

  const svgContent = generateNftSvg(config);

  // Upload SVG to IPFS
  const uri = await upload({
    client,
    files: [new File([svgContent], "astrodice-nft.svg", { type: "image/svg+xml" })],
  });

  return uri;
}

// Generate metadata JSON and upload to IPFS
export async function uploadNftMetadata(params: MintReadingParams): Promise<{
  metadataUri: string;
  imageUri: string;
}> {
  const client = getThirdwebClient();

  const hasAiReading = !!params.aiReading;
  const hasExtendedReading = !!params.extendedReading;

  // First, upload the image
  const imageUri = await uploadNftImage({
    roll: params.roll,
    question: params.question,
    username: params.username,
    timestamp: params.timestamp,
    hasAiReading,
  });

  // Build attributes array
  const attributes: NftAttribute[] = [
    { trait_type: "Planet", value: params.roll.planet },
    { trait_type: "Sign", value: params.roll.sign },
    { trait_type: "House", value: params.roll.house },
    { trait_type: "Has AI Reading", value: hasAiReading ? "Yes" : "No" },
    { trait_type: "Has Extended Reading", value: hasExtendedReading ? "Yes" : "No" },
    { trait_type: "Farcaster FID", value: params.userFid },
  ];

  // Build metadata
  const metadata: NftMetadata = {
    name: `Astrodice Reading #${params.readingId}`,
    description: `${params.roll.planet} in ${params.roll.sign}, ${params.roll.house}${getOrdinalSuffix(params.roll.house)} House. Question: "${params.question}"`,
    image: imageUri,
    external_url: `https://astrodice.xyz/reading/${params.readingId}`,
    attributes,
  };

  // Include interpretation if AI reading was purchased
  if (params.aiReading) {
    let fullInterpretation = params.aiReading;
    if (params.extendedReading) {
      fullInterpretation +=
        "\n\n--- Extended Reading ---\n\n" + params.extendedReading;
    }
    metadata.interpretation = fullInterpretation;
  }

  // Upload metadata JSON
  const metadataUri = await upload({
    client,
    files: [new File([JSON.stringify(metadata, null, 2)], "metadata.json", { type: "application/json" })],
  });

  return { metadataUri, imageUri };
}

// Create metadata without uploading (for preview/testing)
export function createMetadataPreview(params: MintReadingParams): NftMetadata {
  const hasAiReading = !!params.aiReading;
  const hasExtendedReading = !!params.extendedReading;

  const attributes: NftAttribute[] = [
    { trait_type: "Planet", value: params.roll.planet },
    { trait_type: "Sign", value: params.roll.sign },
    { trait_type: "House", value: params.roll.house },
    { trait_type: "Has AI Reading", value: hasAiReading ? "Yes" : "No" },
    { trait_type: "Has Extended Reading", value: hasExtendedReading ? "Yes" : "No" },
    { trait_type: "Farcaster FID", value: params.userFid },
  ];

  return {
    name: `Astrodice Reading #${params.readingId}`,
    description: `${params.roll.planet} in ${params.roll.sign}, ${params.roll.house}${getOrdinalSuffix(params.roll.house)} House`,
    image: "", // Would be set after upload
    external_url: `https://astrodice.xyz/reading/${params.readingId}`,
    attributes,
    interpretation: params.aiReading || undefined,
  };
}
