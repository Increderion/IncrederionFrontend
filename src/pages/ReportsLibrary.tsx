import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/LoadingBar";
import PageBackground from "../components/PageBackground";
import { fetchUserReports, type ReportRow } from "../api/reports";

export default function ReportsLibrary() {
  const auth = useContext(AuthContext);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserReports()
      .then(setReports)
      .catch(() => setError("Nie udało się pobrać listy raportów."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <LoadingBar loading={loading} />
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <PageBackground />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-8 pb-16">
        <header className="mb-10 space-y-2">
          <h1 className="font-mono text-3xl font-bold text-[#1C1819] dark:text-[#F0EFF4]">
            Twoja Biblioteka Raportów
          </h1>
          <p className="font-mono text-sm text-[#9C99A6]">
            Historia wszystkich przeprowadzonych analiz KYC/AML.
          </p>
        </header>

        {loading && (
          <div className="flex justify-center py-20">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#92140C] border-t-transparent" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center font-mono text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#E5E3EC] bg-white/50 dark:bg-[#1C1A22]/50 p-20 text-center">
            <p className="font-mono text-[#9C99A6] mb-6">Nie masz jeszcze żadnych raportów.</p>
            <Link
              to="/"
              className="inline-flex rounded-xl bg-[#92140C] px-6 py-3 font-mono text-sm font-bold text-white shadow-lg hover:bg-[#7a0f0a] transition-all"
            >
              PRZEPROWADŹ PIERWSZĄ ANALIZĘ
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/raport/${report.id}`}
              className="group flex flex-col justify-between rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest ${
                    report.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    report.status === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {report.status === 'completed' ? 'Gotowy' : 
                     report.status === 'running' ? 'W toku' : 
                     report.status === 'failed' ? 'Błąd' : 'Oczekiwanie'}
                  </span>
                  <span className="font-mono text-[10px] text-[#9C99A6]">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-mono text-lg font-bold text-[#1C1819] dark:text-[#F0EFF4] group-hover:text-[#92140C] transition-colors line-clamp-1">
                  {report.company?.name || 'Analiza bez nazwy'}
                </h3>
                <p className="mt-2 font-mono text-xs text-[#9C99A6] line-clamp-2">
                  {report.ai_summary || 'Analiza w trakcie przetwarzania...'}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {(report.events_panels || []).slice(0, 3).map((_, i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-[#1C1A22] bg-[#F0EFF4] dark:bg-[#2A2730] flex items-center justify-center text-[10px]">
                      🚩
                    </div>
                  ))}
                  {(report.events_panels?.length || 0) > 3 && (
                    <div className="h-6 w-6 rounded-full border-2 border-white dark:border-[#1C1A22] bg-[#92140C] text-white flex items-center justify-center text-[8px] font-bold">
                      +{(report.events_panels?.length || 0) - 3}
                    </div>
                  )}
                </div>
                <span className="font-mono text-[10px] font-bold text-[#92140C] opacity-0 group-hover:opacity-100 transition-opacity">
                  SZCZEGÓŁY →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
