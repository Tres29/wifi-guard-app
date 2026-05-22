type DnsResult = { ok: boolean; message: string };

async function blockWithPiHole(domain: string): Promise<DnsResult> {
  const baseUrl = process.env.PIHOLE_URL;
  const token = process.env.PIHOLE_TOKEN;
  if (!baseUrl || !token) return { ok: false, message: "Pi-hole env is missing." };

  const url = `${baseUrl.replace(/\/$/, "")}/admin/api.php?list=black&add=${encodeURIComponent(domain)}&auth=${encodeURIComponent(token)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return { ok: false, message: `Pi-hole request failed: ${response.status}` };
  return { ok: true, message: `${domain} added to Pi-hole blacklist.` };
}

async function unblockWithPiHole(domain: string): Promise<DnsResult> {
  const baseUrl = process.env.PIHOLE_URL;
  const token = process.env.PIHOLE_TOKEN;
  if (!baseUrl || !token) return { ok: false, message: "Pi-hole env is missing." };

  const url = `${baseUrl.replace(/\/$/, "")}/admin/api.php?list=black&sub=${encodeURIComponent(domain)}&auth=${encodeURIComponent(token)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return { ok: false, message: `Pi-hole request failed: ${response.status}` };
  return { ok: true, message: `${domain} removed from Pi-hole blacklist.` };
}

async function blockWithAdGuard(domain: string): Promise<DnsResult> {
  const baseUrl = process.env.ADGUARD_URL;
  const username = process.env.ADGUARD_USERNAME;
  const password = process.env.ADGUARD_PASSWORD;
  if (!baseUrl || !username || !password) return { ok: false, message: "AdGuard env is missing." };

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/control/filtering/add_url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    body: JSON.stringify({ url: domain, name: `Blocked by WiFi Guard: ${domain}` }),
  });

  if (!response.ok) return { ok: false, message: `AdGuard request failed: ${response.status}` };
  return { ok: true, message: `${domain} added to AdGuard filtering.` };
}

export async function applyBlock(domain: string): Promise<DnsResult> {
  const provider = process.env.DNS_PROVIDER || "mock";
  if (provider === "pihole") return blockWithPiHole(domain);
  if (provider === "adguard") return blockWithAdGuard(domain);
  return { ok: true, message: `Mock mode: ${domain} saved only in database.` };
}

export async function removeBlock(domain: string): Promise<DnsResult> {
  const provider = process.env.DNS_PROVIDER || "mock";
  if (provider === "pihole") return unblockWithPiHole(domain);
  return { ok: true, message: `Mock mode: ${domain} removed only in database.` };
}
