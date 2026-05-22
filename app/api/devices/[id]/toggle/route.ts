import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const current = await supabase.from("devices").select("is_blocked").eq("id", id).single();
  if (current.error) return NextResponse.json({ error: current.error.message }, { status: 500 });

  const { data, error } = await supabase
    .from("devices")
    .update({ is_blocked: !current.data.is_blocked })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
