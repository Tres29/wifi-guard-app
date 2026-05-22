import { Card } from "@/components/Card";
import { ShieldCheck, Router, Clock, Ban } from "lucide-react";

const stats = [
  { label: "Devices", value: "Manage", icon: Router },
  { label: "Block Rules", value: "Domains", icon: Ban },
  { label: "Schedules", value: "Time limits", icon: Clock },
  { label: "Mode", value: "DNS Filter", icon: ShieldCheck },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-zinc-950 p-8 sm:p-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Family Wi-Fi Control</p>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Restrict web access safely on your own Wi-Fi.</h1>
        <p className="mt-5 max-w-2xl text-zinc-300">Add devices, block websites, create schedules, and connect this dashboard to Pi-hole or AdGuard Home for real DNS filtering.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <item.icon className="mb-5 text-emerald-300" size={28} />
            <p className="text-sm text-zinc-400">{item.label}</p>
            <h2 className="mt-1 text-2xl font-bold">{item.value}</h2>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-2xl font-bold">Setup needed for real blocking</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-300">
          <li>Install Pi-hole or AdGuard Home on a Raspberry Pi, mini PC, or server.</li>
          <li>Set your router DNS to the Pi-hole/AdGuard device IP.</li>
          <li>Add your Supabase and DNS provider environment variables.</li>
          <li>Deploy the dashboard to Vercel.</li>
        </ol>
      </Card>
    </div>
  );
}
