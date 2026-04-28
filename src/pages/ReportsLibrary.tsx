import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import { fetchUserReports, type ReportRow } from "../api/reports";

export default function ReportsLibrary() {
  const auth = useContext(AuthContext);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await fetchUserReports();
        setReports(data);
      } catch (err) {
        setError("Nie udało się pobrać listy raportów.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      
      <PageBackground>
        <main className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-24">
          {/* Header */}
          <div className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between">
            <div>
              <p className="font-mono mb-2 text-xs font-medium uppercase tracking-widest text-[#92140C]">
                Twoja Historia
              </p>
              <h1 className="font-mono text-4xl font-bold tracking-tight text-[#1C1819] dark:text-[#F0EFF4]">
                Biblioteka Raportów
              </h1>
            </div>
            {!loading && reports.length > 0 && (
              <p className="mt-4 md:mt-0 font-mono text-sm text-[#9C99A6]">
                Znaleziono <span className="text-[#1C1819] dark:text-[#F0EFF4] font-bold">{reports.length}</span> analiz
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white/50 dark:bg-[#1C1A22]/50 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="font-mono text-red-600">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 font-mono text-xs font-bold text-[#92140C] underline">SPRÓBUJ PONOWNIE</button>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white/40 dark:bg-[#1C1A22]/40 p-20 text-center backdrop-blur-md">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EFF4] dark:bg-[#2A2730] text-[#9C99A6]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-mono text-lg font-bold text-[#1C1819] dark:text-[#F0EFF4]">Brak raportów</h3>
              <p className="mt-2 font-mono text-sm text-[#9C99A6] max-w-sm mx-auto">
                Nie przeprowadziłeś jeszcze żadnej analizy KYC. Wyszukaj firmę, aby rozpocząć pierwszy proces.
              </p>
              <Link
                to="/rejestr"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#92140C] px-6 py-3 font-mono text-xs font-bold text-white shadow-lg hover:bg-[#7a0f0a] transition-all"
              >
                PRZEJDŹ DO WYSZUKIWARKI →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report: any) => {
                const company = report.companies || report.company;
                return (
                  <Link
                    key={report.id}
                    to={`/raport/${report.id}`}
                    className="group relative flex flex-col rounded-3xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-[#92140C]/30"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ${
                        report.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        report.status === 'failed' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {report.status === 'completed' ? 'Analiza zakończona' : 
                         report.status === 'running' ? 'Research w toku' : 
                         report.status === 'failed' ? 'Błąd krytyczny' : 'Oczekiwanie'}
                      </span>
                      <span className="font-mono text-[10px] text-[#9C99A6]">
                        {new Date(report.created_at).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>

                    <h3 className="mb-4 font-mono text-xl font-bold text-[#1C1819] dark:text-[#F0EFF4] group-hover:text-[#92140C] transition-colors line-clamp-2 min-h-[3.5rem]">
                      {company?.name || "Brak nazwy"}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-[#F0EFF4] dark:border-[#2E2A38]">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {company?.nip && (
                          <div className="flex flex-col">
                            <span className="font-mono text-[8px] text-[#9C99A6] uppercase tracking-tighter">NIP</span>
                            <span className="font-mono text-[11px] font-bold text-[#1C1819] dark:text-[#F0EFF4]">{company.nip}</span>
                          </div>
                        )}
                        {company?.krs && (
                          <div className="flex flex-col">
                            <span className="font-mono text-[8px] text-[#9C99A6] uppercase tracking-tighter">KRS</span>
                            <span className="font-mono text-[11px] font-bold text-[#1C1819] dark:text-[#F0EFF4]">{company.krs}</span>
                          </div>
                        )}
                        {company?.regon && (
                          <div className="flex flex-col">
                            <span className="font-mono text-[8px] text-[#9C99A6] uppercase tracking-tighter">REGON</span>
                            <span className="font-mono text-[11px] font-bold text-[#1C1819] dark:text-[#F0EFF4]">{company.regon}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                         <span className="font-mono text-[10px] font-bold text-[#92140C] group-hover:underline">OTWÓRZ RAPORT</span>
                         <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0EFF4] dark:bg-[#2A2730] text-[#92140C] group-hover:bg-[#92140C] group-hover:text-white transition-all">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          )}
        </main>
      </PageBackground>
    </>
  );
}
