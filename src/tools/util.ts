export async function fetchJson(
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>
) {
  const url = new URL(`https://jsonplaceholder.typicode.com${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Upstream ${url} responded ${res.status}`);
  return res.json();
}

export function asTextContent(obj: unknown) {
  return [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }];
}
