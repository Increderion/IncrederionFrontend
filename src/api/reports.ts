import type { CompanyRow } from "./companies";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type ReportStatus = "pending" | "running" | "completed" | "failed";

export type ReportRow = {
  id: string;
  user_id: string;
  company_id: string;
  status: ReportStatus;
  error: string | null;
  risk_score: number | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
};

export type FindingCategory = "registry" | "opinion" | "news" | "management";
export type FindingSeverity = "info" | "low" | "medium" | "high" | "critical";

export type ReportFinding = {
  id: string;
  report_id: string;
  company_id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  summary: string | null;
  url: string | null;
  source: string | null;
  published_at: string | null;
  raw_markdown: string | null;
  created_at: string;
};

export type ReportWithDetails = ReportRow & {
  company: CompanyRow;
  findings: ReportFinding[];
};

export type ReportListResponse = {
  data: ReportRow[];
  total: number;
  page: number;
  limit: number;
};

export type ListReportsQuery = {
  status?: ReportStatus;
  company_id?: string;
  page?: number;
  limit?: number;
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("sb-access-token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function createReport(query: string): Promise<{ reportId: string; status: "pending"; company: CompanyRow }> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Nie udało się utworzyć raportu");
  }
  return res.json();
}

export async function listReports(query?: ListReportsQuery): Promise<ReportListResponse> {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  if (query?.company_id) params.set("company_id", query.company_id);
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));

  const qs = params.toString();
  const res = await fetch(`${API_BASE}/reports${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Nie udało się pobrać raportów");
  return res.json();
}

export async function getReport(id: string): Promise<ReportWithDetails | null> {
  const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Nie udało się pobrać raportu");
  return res.json();
}

export async function deleteReport(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Nie udało się usunąć raportu");
}
