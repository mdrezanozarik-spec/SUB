
export async function checkHost(host) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  const start = Date.now();

  try {
    await fetch("https://" + host, {
      method: "HEAD",
      signal: controller.signal
    });

    const latency = Date.now() - start;
    clearTimeout(timeout);

    return { host, ok: true, latency };
  } catch {
    clearTimeout(timeout);
    return { host, ok: false, latency: 999999 };
  }
}
