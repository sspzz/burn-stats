import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { LeaderboardData, LeaderboardRow } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const RESERVOIR_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY as string;

interface Transfer {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

interface ReservoirResponse {
  transfers?: Transfer[];
  continuation?: string;
}

export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const flameContract = "0x31158181b4b91a423bfdc758fc3bf8735711f9c5";
    const flameBurners: { [address: string]: LeaderboardRow } = {};
    
    //Read file from bucket
    const bucketReadResponse = await supabase.storage
      .from("leaderboard")
      .download("flame");
    if (!bucketReadResponse.error && bucketReadResponse.data.text) {
      const text = await bucketReadResponse.data.text();
      const leaderboardJson: LeaderboardData = JSON.parse(text);
      // Check if data is fresh
      if (
        leaderboardJson &&
        leaderboardJson.lastUpdated &&
        new Date().getTime() - leaderboardJson.lastUpdated < 20 * 60 * 1000
      ) {
        console.log("Data is still fresh");
        return NextResponse.json({
          message: "Data is still fresh",
        });
      }
    }
    const maximumRequests = 30;
    let continuation = "";
    for (let i = 0; i < maximumRequests; i++) {
      console.log("Requesting page ", i);
      const transfersResponse = await fetch(
        `https://api.reservoir.tools/transfers/bulk/v1?token=${flameContract}:0&limit=1000${continuation}`,
        {
          headers: {
            "x-api-key": RESERVOIR_KEY,
          },
        }
      );
      const data: ReservoirResponse = await transfersResponse.json();
      if (data.transfers) {
        data.transfers.forEach((transfer) => {
          if (transfer.to === "0x0000000000000000000000000000000000000000") {
            if (flameBurners[transfer.from] !== undefined) {
              flameBurners[transfer.from].burnCount =
                flameBurners[transfer.from].burnCount + Number(transfer.amount);
              if (
                transfer.timestamp >
                flameBurners[transfer.from].latestBurn.timestamp
              ) {
                flameBurners[transfer.from].latestBurn = {
                  timestamp: transfer.timestamp,
                  txHash: transfer.txHash,
                };
              }
            } else {
              flameBurners[transfer.from] = {
                address: transfer.from,
                burnCount: Number(transfer.amount),
                latestBurn: {
                  timestamp: transfer.timestamp,
                  txHash: transfer.txHash,
                },
              };
            }
          }
        });
      }
      if (!data.continuation) {
        console.log("Finished Requesting");
        break;
      } else {
        continuation = `&continuation=${data.continuation}`;
      }
    }
    const leaderboardData: LeaderboardData = {
      leaderboard: Object.values(flameBurners).sort(
        (a, b) => b.burnCount - a.burnCount
      ),
      lastUpdated: new Date().getTime(),
    };
    const uploadResponse = await supabase.storage
      .from("leaderboard")
      .update("flame", JSON.stringify(leaderboardData));
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

