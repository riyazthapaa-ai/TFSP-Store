import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD || "tfsp2025";
  const success = password === adminPassword;
  return NextResponse.json({ success }, { status: success ? 200 : 401 });
}
