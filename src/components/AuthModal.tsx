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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="mb-6 text-xl font-semibold text-[#1C1819]">
          {mode === "login" ? "Logowanie" : "Rejestracja"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#92140C] focus:outline-none focus:ring-1 focus:ring-[#92140C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#92140C] focus:outline-none focus:ring-1 focus:ring-[#92140C]"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Powtórz hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#92140C] focus:outline-none focus:ring-1 focus:ring-[#92140C]"
              />
            </div>
          )}

          {info && <p className="text-sm text-green-600">{info}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#92140C] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a0f0a] disabled:opacity-50"
          >
            {loading ? "Ładowanie..." : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" ? "Nie masz konta? " : "Masz konto? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="font-medium text-[#92140C] hover:underline"
          >
            {mode === "login" ? "Zarejestruj się" : "Zaloguj się"}
          </button>
        </p>
      </div>
    </div>
  );
}
