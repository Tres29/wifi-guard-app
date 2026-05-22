import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { removeBlock } from "@/lib/dnsProvider";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const found = await supabase.from("block_rules").select("domain").eq("id", id).single();
  if (found.error) return NextResponse.json({ error: found.error.message }, { status: 500 });

  await removeBlock(found.data.domain);
  const { error } = await supabase.from("block_rules").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
