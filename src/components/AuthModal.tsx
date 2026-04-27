import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Mode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (mode) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setInfo("");
    }
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Hasła nie są identyczne");
        return;
      }
      if (password.length < 8) {
        setError("Hasło musi mieć minimum 8 znaków");
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Wystąpił błąd");
        return;
      }

      if (mode === "register" && data.requiresEmailConfirmation) {
        setMode("login");
        setInfo("Sprawdź skrzynkę email i potwierdź konto, a następnie się zaloguj.");
        return;
      }

      if (data.tokens?.accessToken) {
        localStorage.setItem("sb-access-token", data.tokens.accessToken);
        window.dispatchEvent(new Event("storage"));
      }

      onClose();
    } catch {
      setError("Nie udało się połączyć z serwerem");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-lg border border-[#D8D6E0] dark:border-[#2E2A38] bg-white dark:bg-[#1C1A22] px-3 py-2 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] focus:border-[#92140C] focus:outline-none focus:ring-1 focus:ring-[#92140C] transition";

  const labelClass = "block text-sm font-medium text-[#1C1819] dark:text-[#D8D6E0]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-[#D8D6E0] dark:border-[#2E2A38] bg-[#F8F7FC] dark:bg-[#16141D] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9C99A6] dark:text-[#6E6B78] hover:text-[#1C1819] dark:hover:text-[#F0EFF4] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-6 text-xl font-semibold text-[#1C1819] dark:text-[#F0EFF4]">
          {mode === "login" ? "Logowanie" : "Rejestracja"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Hasło</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          </div>

          {mode === "register" && (
            <div>
              <label className={labelClass}>Powtórz hasło</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
            </div>
          )}

          {info && <p className="text-sm text-emerald-600 dark:text-emerald-400">{info}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#92140C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7a0f0a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Ładowanie..." : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#9C99A6] dark:text-[#6E6B78]">
          {mode === "login" ? "Nie masz konta? " : "Masz konto? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="font-medium text-[#92140C] hover:underline"
          >
            {mode === "login" ? "Zarejestruj się" : "Zaloguj się"}
          </button>
        </p>
      </div>
    </div>
  );
}
