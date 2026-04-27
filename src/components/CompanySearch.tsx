import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanySearch, type Company } from "../api/companies";

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const showResults = focused && query.trim().length >= 2;

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetchCompanySearch(query)
        .then((res) => { setResults(res); setActiveIndex(-1); })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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

  function handleSelect(company: Company) {
    setFocused(false);
    navigate(`/firma/${company.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results.length === 1 ? results[0] : null;
      if (target) handleSelect(target);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 bg-white px-5 py-4 shadow-lg transition-all ${
          focused
            ? "border-[#92140C] shadow-[#92140C]/10 shadow-xl"
            : "border-[#E5E3EC] hover:border-[#92140C]/40"
        }`}
      >
        {loading ? (
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
          className="flex-1 bg-transparent text-base text-[#1C1819] placeholder:text-[#9C99A6] outline-none font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="shrink-0 text-[#9C99A6] hover:text-[#1C1819] transition-colors"
            tabIndex={-1}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showResults && !loading && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#E5E3EC] bg-white shadow-2xl shadow-black/10 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center font-mono text-sm text-[#9C99A6]">
              Brak wyników dla&nbsp;<span className="text-[#1C1819] font-medium">"{query}"</span>
            </div>
          ) : (
            <ul ref={listRef} className="max-h-[400px] overflow-y-auto">
              {results.map((company, i) => (
                <li key={company.id}>
                  <button
                    onClick={() => handleSelect(company)}
                    className={`w-full text-left px-5 py-4 flex items-start gap-4 transition-colors ${
                      i !== 0 ? "border-t border-[#F0EFF4]" : ""
                    } ${activeIndex === i ? "bg-[#F7F6FB]" : "hover:bg-[#F7F6FB]"}`}
                  >
                    <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EFF4]">
                      <svg className="h-4 w-4 text-[#92140C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono font-semibold text-sm text-[#1C1819] truncate">{company.name}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                        <span className="font-mono text-xs text-[#9C99A6]">
                          NIP: <span className="text-[#5C5867]">{company.nip}</span>
                        </span>
                        <span className="font-mono text-xs text-[#9C99A6]">
                          KRS: <span className="text-[#5C5867]">{company.krs}</span>
                        </span>
                        <span className="font-mono text-xs text-[#9C99A6]">{company.city}</span>
                      </div>
                    </div>
                    <div className="shrink-0 self-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-medium ${
                        company.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${company.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {company.status === "active" ? "Aktywna" : "Nieaktywna"}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
