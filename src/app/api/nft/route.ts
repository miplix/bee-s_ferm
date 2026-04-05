import { NextRequest, NextResponse } from "next/server";

const API_KEY = "j9mwYHIkRsmhM7dOoJy9yBSEdSZSWtBw02BOIGy3jzk";
const CONTRACT = "yuplandshop.mintbase1.near";
const IPFS_GW = "https://gateway.dialog-tbot.com/ipfs";

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner");
  if (!owner) return NextResponse.json({ items: [] }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.sendler.xyz/nft/by-owner-contract/?owner_id=${encodeURIComponent(owner)}&contract_address=${CONTRACT}&skip=0&limit=1000`,
      { headers: { accept: "application/json", "X-API-Key": API_KEY }, next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json({ items: [] });
    const data = await res.json();

    // Filter: title must contain "bee" (case-insensitive)
    const filtered = (data.items || [])
      .filter((item: any) => item.title && item.title.toLowerCase().includes("bee"))
      .map((item: any) => ({
        token_id: item.token_id,
        title: item.title,
        media: item.media ? `${IPFS_GW}/${item.media}` : null,
      }));

    return NextResponse.json({ items: filtered });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
