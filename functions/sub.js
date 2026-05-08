import { extractHost } from "../src/parser.js";
import { checkHost } from "../src/checker.js";
import { getCache, setCache } from "../src/cache.js";

const SUB_URL = "https://raw.githubusercontent.com/mdreza-n/mixora/refs/heads/main/Mixora-Netl.txt";

async function fetchSub() {
  const res = await fetch(SUB_URL);
  return (await res.text()).split("\n").filter(Boolean);
}

async function runChecks(hosts) {
  const results = [];
  let i = 0;

  async function worker() {
    while (i < hosts.length) {
      const idx = i++;
      const r = await checkHost(hosts[idx]);
      results.push(r);
    }
  }

  await Promise.all(Array.from({ length: 20 }, worker));
  return results;
}

export async function onRequest() {
  const cached = getCache("sub");
  if (cached) {
    return new Response(cached, {
      headers: { "content-type": "text/plain" }
    });
  }

  const lines = await fetchSub();

  const hosts = [];
  for (const l of lines) {
    const h = extractHost(l);
    if (h) hosts.push(h);
  }

  const results = await runChecks(hosts);

  const top = results
    .filter(r => r.ok)
    .sort((a, b) => a.latency - b.latency)
    .slice(0, 10)
    .map(r => r.host);

  const out = top.join("\n");

  setCache("sub", out, 120000);

  return new Response(out, {
    headers: { "content-type": "text/plain" }
  });
}