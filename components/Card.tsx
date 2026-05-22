export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 ${className}`}>{children}</section>;
}
