import { NextResponse } from "next/server";
import { applyBlock } from "@/lib/dnsProvider";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("block_rules").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const domain = String(body.domain || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!domain) return NextResponse.json({ error: "Domain is required." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const dns = await applyBlock(domain);
  const { data, error } = await supabase
    .from("block_rules")
    .insert({ domain, reason: body.reason || null, enabled: true })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, dns_message: dns.message }, { status: 201 });
}
