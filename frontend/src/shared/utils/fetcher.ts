export async function fetcher(url: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const err = new Error("Error fetching data");
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}
