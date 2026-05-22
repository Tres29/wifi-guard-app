"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import type { Device } from "@/lib/types";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState({ name: "", owner: "", mac_address: "", ip_address: "" });
  const [loading, setLoading] = useState(false);

  async function loadDevices() {
    const res = await fetch("/api/devices", { cache: "no-store" });
    if (res.ok) setDevices(await res.json());
  }

  useEffect(() => { loadDevices(); }, []);

  async function addDevice(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/devices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", owner: "", mac_address: "", ip_address: "" });
    await loadDevices();
    setLoading(false);
  }

  async function toggle(id: string) {
    await fetch(`/api/devices/${id}/toggle`, { method: "PATCH" });
    await loadDevices();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Devices</h1>
      <Card>
        <form onSubmit={addDevice} className="grid gap-3 md:grid-cols-5">
          <input required placeholder="Device name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input placeholder="MAC address" value={form.mac_address} onChange={(e) => setForm({ ...form, mac_address: e.target.value })} />
          <input placeholder="IP address" value={form.ip_address} onChange={(e) => setForm({ ...form, ip_address: e.target.value })} />
          <button disabled={loading} className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-zinc-950 hover:bg-emerald-400">Add</button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {devices.map((device) => (
          <Card key={device.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{device.name}</h2>
                <p className="text-sm text-zinc-400">Owner: {device.owner || "N/A"}</p>
                <p className="text-sm text-zinc-400">IP: {device.ip_address || "N/A"}</p>
                <p className="text-sm text-zinc-400">MAC: {device.mac_address || "N/A"}</p>
              </div>
              <button onClick={() => toggle(device.id)} className={`rounded-full px-4 py-2 text-sm font-bold ${device.is_blocked ? "bg-red-500 text-white" : "bg-emerald-500 text-zinc-950"}`}>
                {device.is_blocked ? "Blocked" : "Allowed"}
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-500">Device blocking is stored in the database. To fully cut internet per device, connect router firewall/API or use gateway mode.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
