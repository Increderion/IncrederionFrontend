import { type Company } from "../data/mockCompanies";

export type { Company };

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// TODO: replace with real endpoint → GET /api/companies/search?q={query}
export async function fetchCompanySearch(query: string): Promise<Company[]> {
  const res = await fetch(`${API_BASE}/api/companies/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// TODO: replace with real endpoint → GET /api/companies/{id}
export async function fetchCompanyById(id: string): Promise<Company | null> {
  const res = await fetch(`${API_BASE}/api/companies/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
