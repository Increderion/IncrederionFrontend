const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type CompanyRow = {
  id: string;
  name: string;
  nip: string | null;
  krs: string | null;
  regon: string | null;
  legal_form: string | null;
  industry: string | null;
  registration_date: string | null;
  president_name: string | null;
  registry_source_url: string | null;
  registry_raw_markdown: string | null;
  registry_raw_metadata: Record<string, unknown> | null;
  registry_sync_status: string;
  last_registry_sync_at: string | null;
  registry_sync_error: string | null;
  created_at: string;
  updated_at: string;
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("sb-access-token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function fetchCompanySearch(query: string): Promise<CompanyRow[]> {
  const res = await fetch(`${API_BASE}/companies/autocomplete/${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}


export async function fetchCompanyById(id: string): Promise<CompanyRow | null> {
  const res = await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
