"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import type { Device, Schedule } from "@/lib/types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [form, setForm] = useState({ device_id: "", start_time: "22:00", end_time: "06:00", days: [] as string[] });

  async function load() {
    const [d, s] = await Promise.all([fetch("/api/devices"), fetch("/api/schedules")]);
    if (d.ok) setDevices(await d.json());
    if (s.ok) setSchedules(await s.json());
  }

  useEffect(() => { load(); }, []);

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/schedules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
  }

  function toggleDay(day: string) {
    setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Schedules</h1>
      <Card>
        <form onSubmit={addSchedule} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <select required value={form.device_id} onChange={(e) => setForm({ ...form, device_id: e.target.value })}>
              <option value="">Select device</option>
              {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => <button type="button" key={day} onClick={() => toggleDay(day)} className={`rounded-full px-4 py-2 text-sm ${form.days.includes(day) ? "bg-emerald-500 text-zinc-950" : "border border-white/10 text-zinc-300"}`}>{day}</button>)}
          </div>
          <button className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-zinc-950 hover:bg-emerald-400">Save Schedule</button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {schedules.map((s) => (
          <Card key={s.id}>
            <h2 className="text-xl font-bold">{s.devices?.name || "Device"}</h2>
            <p className="text-zinc-300">{s.start_time} - {s.end_time}</p>
            <p className="text-sm text-zinc-400">Days: {s.days?.join(", ") || "None"}</p>
            <p className="mt-3 text-xs text-zinc-500">Schedule is saved. To enforce it automatically, run a cron job or server task connected to your router/DNS provider.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
