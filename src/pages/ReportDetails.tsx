import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/LoadingBar";
import PageBackground from "../components/PageBackground";
import { fetchReportById, type ReportRow, type EventPanel } from "../api/reports";

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    critical: { cls: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
    high: { cls: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
    medium: { cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    low: { cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    info: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  };
  const b = map[severity] ?? map.info;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${b.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
      {severity}
    </span>
  );
}

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let pollInterval: any;

    const load = async () => {
      try {
        const data = await fetchReportById(id);
        setReport(data);
        setError(null);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(pollInterval);
        }
      } catch (err) {
        setError("Nie udało się pobrać raportu.");
        clearInterval(pollInterval);
      } finally {
        setLoading(false);
      }
    };

    load();
    // Poll every 3 seconds if report is not finished
    pollInterval = setInterval(load, 3000);

    return () => clearInterval(pollInterval);
  }, [id]);

  return (
    <>
      <LoadingBar loading={loading || report?.status === "running" || report?.status === "pending"} />
      <Navbar loggedIn={auth?.loggedIn ?? false} />

      <PageBackground>
        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-8 pb-16">
          {loading && !report && (
            <div className="flex flex-col items-center justify-center pt-12">
              <svg className="h-10 w-10 text-[#92140C] animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="font-mono text-sm text-[#9C99A6]">Inicjowanie researchu...</p>
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] p-6 shadow-xl shadow-black/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ${report.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        report.status === 'failed' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                      {report.status === 'completed' ? 'Analiza zakończona' :
                        report.status === 'running' ? 'Research w toku' :
                          report.status === 'failed' ? 'Błąd' : 'Oczekiwanie'}
                    </span>
                    <span className="font-mono text-[10px] text-[#9C99A6]">
                      ID: {report.id.slice(0, 8)}
                    </span>
                  </div>
                  <h1 className="font-mono text-2xl font-bold text-[#1C1819] dark:text-[#F0EFF4]">
                    {report.company?.name || "Analiza firmy"}
                  </h1>
                  <p className="font-mono text-[10px] text-[#9C99A6]">
                    Data raportu: {new Date(report.created_at).toLocaleString('pl-PL')}
                  </p>
                </div>

                {report.status === "running" && (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#F7F6FB] dark:bg-[#242130] border border-[#E5E3EC] dark:border-[#2E2A38]">
                    <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-[#E5E3EC] dark:bg-[#2E2A38]">
                      <div className="absolute inset-y-0 left-0 bg-[#92140C] animate-shimmer" style={{ width: '40%' }}></div>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#92140C] uppercase tracking-tighter">Przetwarzanie...</span>
                  </div>
                )}
              </div>

              {/* AI Summary Section */}
              {report.ai_summary && (
                <div className="rounded-3xl border border-[#92140C]/20 bg-gradient-to-br from-white to-[#FDF2F2] dark:from-[#1C1A22] dark:to-[#2A1515] p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#92140C] text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                      </svg>
                    </div>
                    <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[#92140C]">
                      Wnioski AI (KYC Insight)
                    </h2>
                  </div>
                  <p className="font-mono text-base leading-relaxed text-[#1C1819] dark:text-[#F0EFF4]">
                    {report.ai_summary}
                  </p>
                </div>
              )}

              {/* Events Panels (Labels) */}
              {report.events_panels && report.events_panels.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {report.events_panels.map((panel, idx) => (
                    <div key={idx} className="group relative rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-3">
                        <SeverityBadge severity={panel.severity} />
                      </div>
                      <h3 className="font-mono text-lg font-bold text-[#1C1819] dark:text-[#F0EFF4] mb-2 group-hover:text-[#92140C] transition-colors">
                        {panel.label}
                      </h3>
                      <p className="font-mono text-xs leading-relaxed text-[#9C99A6] dark:text-[#6E6B78]">
                        {panel.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Findings Section */}
              {report.findings && report.findings.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#9C99A6] px-2">
                    Źródła i dowody ({report.findings.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {report.findings.map((finding) => (
                      <div key={finding.id} className="flex gap-4 rounded-2xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white/50 dark:bg-[#1C1A22]/50 p-4 backdrop-blur-sm">
                        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0EFF4] dark:bg-[#2A2730] text-[#92140C]">
                          {finding.category === 'opinion' ? '⭐' : finding.category === 'news' ? '📰' : '🏢'}
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-[#9C99A6] truncate">
                              {finding.source || finding.category}
                            </span>
                            <SeverityBadge severity={finding.severity} />
                          </div>
                          <h4 className="font-mono text-sm font-bold text-[#1C1819] dark:text-[#F0EFF4] break-words">
                            {finding.title}
                          </h4>
                          <p className="font-mono text-xs leading-relaxed text-[#5C5867] dark:text-[#9C99A6] line-clamp-3 break-words">
                            {finding.summary}
                          </p>
                          {finding.url && (
                            <a href={finding.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#92140C] hover:underline max-w-full overflow-hidden">
                              <span className="truncate">ZOBACZ ŹRÓDŁO</span> <span aria-hidden>↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.status === 'failed' && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                  <p className="font-mono text-sm text-red-600">Błąd: {report.error}</p>
                </div>
              )}
            </div>
          )}
        </main>
      </PageBackground>
    </>
  );
}

