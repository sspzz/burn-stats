import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { ShameData } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    //Read file from bucket
    const bucketReadResponse = await supabase.storage
      .from("wizard-flame-owners")
      .download("owners");

    if (!bucketReadResponse.error && bucketReadResponse.data.text) {
      const text = await bucketReadResponse.data.text();
      const ownersJson: ShameData = JSON.parse(text);

      //Check if data is fresh
      if (ownersJson) {
        return NextResponse.json(ownersJson);
      } else {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }
    }
    return NextResponse.json({ error: "No data found" }, { status: 400 });
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

