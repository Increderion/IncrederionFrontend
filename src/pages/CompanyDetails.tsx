import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/LoadingBar";
import PageBackground from "../components/PageBackground";
import { fetchCompanyById, type CompanyRow } from "../api/companies";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-mono text-[#9C99A6] uppercase tracking-wide">{label}</span>
      <span className="font-mono text-sm text-[#1C1819]">{value}</span>
    </div>
  );
}

function SyncBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    ok: { label: "Zsynchronizowano", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    error: { label: "Błąd synchronizacji", cls: "bg-red-50 text-red-600", dot: "bg-red-500" },
    pending: { label: "Oczekuje", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
    running: { label: "W trakcie", cls: "bg-blue-50 text-blue-700", dot: "bg-blue-400" },
  };
  const badge = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium ${badge.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
      {badge.label}
    </span>
  );
}

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchCompanyById(id)
      .then((data) => {
        if (!data) setError("Nie znaleziono firmy.");
        else setCompany(data);
      })
      .catch(() => setError("Nie udało się pobrać danych firmy."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <LoadingBar loading={loading} />
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <PageBackground />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-16">
        {loading && (
          <div className="flex justify-center pt-20">
            <svg className="h-8 w-8 text-[#92140C] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="font-mono text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && company && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E3EC] bg-white px-8 py-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-mono text-2xl font-bold text-[#1C1819]">{company.name}</h1>
                  {company.legal_form && (
                    <p className="mt-1 font-mono text-sm text-[#9C99A6]">{company.legal_form}</p>
                  )}
                </div>
                <SyncBadge status={company.registry_sync_status} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E3EC] bg-white px-8 py-6 shadow-sm">
              <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[#9C99A6]">
                Dane identyfikacyjne
              </h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <Field label="NIP" value={company.nip} />
                <Field label="KRS" value={company.krs} />
                <Field label="REGON" value={company.regon} />
                <Field label="Forma prawna" value={company.legal_form} />
                <Field label="Branża" value={company.industry} />
                <Field label="Data rejestracji" value={company.registration_date} />
                <Field label="Prezes/Reprezentant" value={company.president_name} />
              </div>
            </div>

            {company.registry_raw_markdown && (
              <div className="rounded-2xl border border-[#E5E3EC] bg-white px-8 py-6 shadow-sm">
                <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[#9C99A6]">
                  Dane z rejestru
                </h2>
                {company.registry_source_url && (
                  <a
                    href={company.registry_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#92140C] hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Źródło: rejestr.io
                  </a>
                )}
                <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-[#F7F6FB] p-4 font-mono text-xs text-[#5C5867]">
                  {company.registry_raw_markdown}
                </pre>
              </div>
            )}

            {company.last_registry_sync_at && (
              <p className="text-right font-mono text-xs text-[#9C99A6]">
                Ostatnia synchronizacja:{" "}
                {new Date(company.last_registry_sync_at).toLocaleString("pl-PL")}
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
