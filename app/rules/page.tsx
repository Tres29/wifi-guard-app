"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import type { BlockRule } from "@/lib/types";

export default function RulesPage() {
  const [rules, setRules] = useState<BlockRule[]>([]);
  const [form, setForm] = useState({ domain: "", reason: "" });
  const [message, setMessage] = useState("");

  async function loadRules() {
    const res = await fetch("/api/rules", { cache: "no-store" });
    if (res.ok) setRules(await res.json());
  }

  useEffect(() => { loadRules(); }, []);

  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setMessage(data.dns_message || data.error || "Saved.");
    setForm({ domain: "", reason: "" });
    await loadRules();
  }

  async function removeRule(id: string) {
    await fetch(`/api/rules/${id}`, { method: "DELETE" });
    await loadRules();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Website Block Rules</h1>
      <Card>
        <form onSubmit={addRule} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input required placeholder="example.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          <input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-zinc-950 hover:bg-emerald-400">Block Website</button>
        </form>
        {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{rule.domain}</h2>
                <p className="text-sm text-zinc-400">{rule.reason || "No reason added"}</p>
              </div>
              <button onClick={() => removeRule(rule.id)} className="rounded-xl border border-red-400/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">Remove</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
