
function b64Decode(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

export function extractHost(line) {
  try {
    if (line.startsWith("vmess://")) {
      const data = line.replace("vmess://", "");
      const json = b64Decode(data);
      if (json && json.add) return json.add;
    }

    if (line.startsWith("vless://") || line.startsWith("trojan://")) {
      const at = line.indexOf("@");
      if (at !== -1) {
        const hostPart = line.slice(at + 1);
        return hostPart.split(":")[0].split("?")[0];
      }
    }

    return null;
  } catch {
    return null;
  }
}
