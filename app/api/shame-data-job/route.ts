import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { ShameData, OwnerData, TokenData } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const RESERVOIR_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY as string;

interface OwnerResponse {
  address: string;
  ownership: {
    tokenCount: number;
  };
}

interface OwnersResponse {
  owners?: OwnerResponse[];
}

interface TokenResponse {
  token: {
    contract: string;
    tokenId: string;
    name: string;
    image: string;
  };
}

interface TokensResponse {
  tokens?: TokenResponse[];
}

export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const flameContract = "0x31158181b4b91a423bfdc758fc3bf8735711f9c5";
    const wizardContract = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";
    let flameOwners: { [address: string]: number } = {};
    const ownerTokens: OwnerData[] = [];

    //Read file from bucket
    const bucketReadResponse = await supabase.storage
      .from("wizard-flame-owners")
      .download("owners");

    if (!bucketReadResponse.error && bucketReadResponse.data.text) {
      const text = await bucketReadResponse.data.text();
      const ownersJson: ShameData = JSON.parse(text);

      //Check if data is fresh
      if (
        ownersJson &&
        ownersJson.lastUpdated &&
        new Date().getTime() - ownersJson.lastUpdated < 20 * 60 * 1000
      ) {
        console.log("Data is still fresh");
        return NextResponse.json({
          message: "Data is still fresh",
        });
      }
    }

    //Find all owners that own a wizard and a flame
    const ownersResponse = await fetch(
      `https://api.reservoir.tools/owners/v1?collection=${flameContract}&offset=0&limit=500`,
      {
        headers: {
          "x-api-key": RESERVOIR_KEY,
        },
      }
    );

    const data: OwnersResponse = await ownersResponse.json();

    if (data && data.owners) {
      flameOwners = data.owners.reduce((owners, owner) => {
        owners[owner.address] = owner.ownership.tokenCount;
        return owners;
      }, {} as { [address: string]: number });
    }

    const flameOwnerKeys = Object.keys(flameOwners);

    const tokenPromises = flameOwnerKeys.map((address) =>
      fetch(
        `https://api.reservoir.tools/users/${address}/tokens/v5?collection=${wizardContract}&offset=0&limit=100`,
        {
          headers: {
            "x-api-key": RESERVOIR_KEY,
          },
        }
      )
    );
    const promises = await Promise.allSettled(tokenPromises);
    const responses = await Promise.all(
      promises
        .filter((promise) => promise.status === "fulfilled" && promise.value)
        .map((promise) => (promise as PromiseFulfilledResult<Response>).value.json())
    ) as TokensResponse[];
    
    responses.forEach((tokensData, i) => {
      if (tokensData && tokensData.tokens && tokensData.tokens.length > 0) {
        const address = flameOwnerKeys[i];
        const owner: OwnerData = {
          owner: address,
          tokens: [],
          flameCount: flameOwners[address],
        };

        tokensData.tokens.forEach((tokenData) => {
          const token: TokenData = {
            contract: tokenData.token.contract,
            tokenId: tokenData.token.tokenId,
            name: tokenData.token.name,
            image: tokenData.token.image,
          };
          owner.tokens.push(token);
        });
        ownerTokens.push(owner);
      }
    });

    const shameData: ShameData = {
      owners: ownerTokens.sort((a, b) => b.flameCount - a.flameCount),
      lastUpdated: new Date().getTime(),
    };

    const uploadResponse = await supabase.storage
      .from("wizard-flame-owners")
      .update("owners", JSON.stringify(shameData));

    if (uploadResponse.error) {
      console.log(`Data upload error: ${uploadResponse.error}`);
      throw new Error(uploadResponse.error.message);
    } else {
      console.log("Uploaded data successfully");
      return NextResponse.json({
        message: "success",
      });
    }
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      {
        error: error.message ? error.message : "Error",
      },
      { status: 400 }
    );
  }
}

