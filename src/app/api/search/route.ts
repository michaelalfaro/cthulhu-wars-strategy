import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search-index";

// Cache the index between requests
let cachedIndex: ReturnType<typeof buildSearchIndex> | null = null;

export async function GET() {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return NextResponse.json(cachedIndex);
}
