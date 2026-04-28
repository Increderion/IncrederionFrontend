import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanySearch, type CompanyRow } from "../api/companies";
import { AuthContext } from "../auth-context";
import { createReport } from "../api/reports";

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanyRow[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const showResults = focused && query.trim().length >= 2;

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setActiveIndex(-1);
      setAutocompleteLoading(false);
      return;
    }

    if (!auth?.loggedIn) {
      setResults([]);
      setAutocompleteLoading(false);
      return;
    }

    setAutocompleteLoading(true);
    const timer = setTimeout(() => {
      console.log("[CompanySearch] fetching autocomplete for:", query);
      fetchCompanySearch(query)
        .then((res) => { setResults(res); setActiveIndex(-1); })
        .catch((err) => { console.error("[CompanySearch] autocomplete error:", err); setResults([]); })
        .finally(() => setAutocompleteLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, auth?.loggedIn]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSearch(searchQuery: string) {
    if (!searchQuery.trim() || searchLoading) return;
    
    if (!auth?.loggedIn) {
       alert("Zaloguj się, aby rozpocząć proces researchu KYC.");
       return;
    }

    console.log("[CompanySearch] triggering search for:", searchQuery);
    setSearchLoading(true);
    try {
      const { reportId } = await createReport(searchQuery);
      console.log("[CompanySearch] search successful, reportId:", reportId);
      navigate(`/raport/${reportId}`);
    } catch (err) {
      console.error("[CompanySearch] search failed:", err);
      alert("Wystąpił błąd podczas uruchamiania analizy. Sprawdź połączenie z serwerem.");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleSelect(company: CompanyRow) {
    setQuery(company.name);
    setFocused(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (showResults) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (showResults && activeIndex >= 0) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  }

  function syncStatusBadge(status: string) {
    if (status === "ok") return { label: "Aktywna", cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" };
    if (status === "error") return { label: "Błąd", cls: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400", dot: "bg-red-500" };
    return { label: "W trakcie", cls: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", dot: "bg-amber-400" };
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 bg-white dark:bg-[#1C1A22] px-5 py-4 shadow-lg transition-all ${
          focused
            ? "border-[#92140C] shadow-[#92140C]/10 shadow-xl"
            : "border-[#E5E3EC] dark:border-[#2E2A38] hover:border-[#92140C]/40"
        }`}
      >
        {autocompleteLoading || searchLoading ? (
          <svg className="shrink-0 h-5 w-5 text-[#92140C] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg
            className={`shrink-0 h-5 w-5 transition-colors ${focused ? "text-[#92140C]" : "text-[#9C99A6]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.803 15.803 7.5 7.5 0 0 0 15.803 15.803z" />
          </svg>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz nazwę firmy, NIP lub KRS..."
          className="flex-1 bg-transparent text-base text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] outline-none font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex items-center gap-2">
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="shrink-0 text-[#9C99A6] hover:text-[#1C1819] dark:hover:text-[#F0EFF4] transition-colors p-1"
              tabIndex={-1}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || searchLoading}
            className="shrink-0 rounded-lg bg-[#92140C] px-4 py-2 text-xs font-mono font-bold text-white shadow-sm hover:bg-[#7a0f0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            SZUKAJ
          </button>

        </div>
      </div>


      {showResults && !autocompleteLoading && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#E5E3EC] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] shadow-2xl shadow-black/10 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center font-mono text-sm text-[#9C99A6] dark:text-[#6E6B78]">
              Brak wyników dla&nbsp;<span className="text-[#1C1819] dark:text-[#F0EFF4] font-medium">"{query}"</span>
            </div>
          ) : (
            <ul ref={listRef} className="max-h-[400px] overflow-y-auto">
              {results.map((company, i) => {
                const badge = syncStatusBadge(company.registry_sync_status);
                return (
                  <li key={company.id}>
                    <button
                      onClick={() => handleSelect(company)}
                      className={`w-full text-left px-5 py-4 flex items-start gap-4 transition-colors ${
                        i !== 0 ? "border-t border-[#F0EFF4] dark:border-[#2E2A38]" : ""
                      } ${activeIndex === i ? "bg-[#F7F6FB] dark:bg-[#242130]" : "hover:bg-[#F7F6FB] dark:hover:bg-[#242130]"}`}
                    >
                      <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFF4] dark:bg-[#2A2730]">
                        <svg className="h-4 w-4 text-[#92140C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono font-semibold text-sm text-[#1C1819] dark:text-[#F0EFF4] truncate">{company.name}</p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                          {company.nip && (
                            <span className="font-mono text-xs text-[#9C99A6]">
                              NIP: <span className="text-[#5C5867] dark:text-[#9C99A6]">{company.nip}</span>
                            </span>
                          )}
                          {company.krs && (
                            <span className="font-mono text-xs text-[#9C99A6]">
                              KRS: <span className="text-[#5C5867] dark:text-[#9C99A6]">{company.krs}</span>
                            </span>
                          )}
                          {company.legal_form && (
                            <span className="font-mono text-xs text-[#9C99A6]">{company.legal_form}</span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 self-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-medium ${badge.cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
