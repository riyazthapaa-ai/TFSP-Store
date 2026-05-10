import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

type ShippingRate = {
  location: string;
  rateLight: number;
  rateMedium: number;
  ratePerExtraKg: number;
  deliveryTime?: string;
};

const shippingPath = path.join(process.cwd(), "data", "shipping-rates.json");

async function readShippingRates(): Promise<ShippingRate[]> {
  const raw = await fs.readFile(shippingPath, "utf-8");
  const parsed = JSON.parse(raw) as ShippingRate[];
  return parsed
    .filter((entry) => typeof entry.location === "string" && Number.isFinite(Number(entry.rateMedium)))
    .map((entry) => ({
      location: entry.location.trim(),
      rateLight: Math.round(Number(entry.rateLight)),
      rateMedium: Math.round(Number(entry.rateMedium)),
      ratePerExtraKg: Math.round(Number(entry.ratePerExtraKg)),
      deliveryTime: entry.deliveryTime?.trim() || "2-3 days",
    }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const rates = await readShippingRates();

  if (!q) {
    return NextResponse.json([]);
  }

  const matches = rates
    .filter((entry) => entry.location.toLowerCase().includes(q))
    .slice(0, 10)
    .map((entry) => ({
      location: entry.location,
      rateLight: Number(entry.rateLight),
      rateMedium: Number(entry.rateMedium),
      ratePerExtraKg: Number(entry.ratePerExtraKg),
      deliveryTime: entry.deliveryTime,
    }));

  return NextResponse.json(matches);
}