const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type ReportFinding = {
  id: string;
  category: string;
  severity: string;
  title: string;
  summary: string | null;
  url: string | null;
  source: string | null;
  raw_markdown: string | null;
  published_at: string | null;
};

export type EventPanel = {
  label: string;
  description: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
};

export type ReportRow = {
  id: string;
  user_id: string;
  company_id: string;
  status: "pending" | "running" | "completed" | "failed";
  error: string | null;
  events_panels: EventPanel[];
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  findings?: ReportFinding[];
  company?: {
    name: string;
    nip: string | null;
    krs: string | null;
  };
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("sb-access-token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function createReport(query: string): Promise<{ reportId: string }> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to create report");
  return res.json();
}

export async function fetchReportById(id: string): Promise<ReportRow> {
  const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
}

export async function fetchUserReports(): Promise<{ data: ReportRow[]; total: number }> {
  const res = await fetch(`${API_BASE}/reports`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

