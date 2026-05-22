import Link from "next/link";
import { Shield } from "lucide-react";

const links = [
  ["Dashboard", "/"],
  ["Devices", "/devices"],
  ["Rules", "/rules"],
  ["Schedules", "/schedules"],
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="rounded-2xl bg-emerald-500/20 p-2 text-emerald-300"><Shield size={22} /></span>
          WiFi Guard
        </Link>
        <div className="flex flex-wrap gap-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:border-emerald-400 hover:text-white">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
