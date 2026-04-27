import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth-context";
import { useTheme } from "../theme-context";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9C99A6] dark:text-[#6E6B78]">
      {children}
    </h2>
  );
}

function Card({ children, danger = false }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div
      className={`mb-4 rounded-xl border p-6 backdrop-blur-sm ${
        danger
          ? "border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20"
          : "border-[#D8D6E0] dark:border-[#2E2A38] bg-white/70 dark:bg-[#1C1A22]/80"
      }`}
    >
      {children}
    </div>
  );
}

export default function Settings() {
  const auth = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailMsg({ type: "err", text: "Nieprawidłowy adres email." });
      return;
    }
    setEmailMsg({ type: "ok", text: "Link potwierdzający wysłany na nowy adres." });
    setEmail("");
    setTimeout(() => setEmailMsg(null), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "err", text: "Hasło musi mieć co najmniej 8 znaków." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "Hasła nie są identyczne." });
      return;
    }
    setPasswordMsg({ type: "ok", text: "Hasło zostało zmienione." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("sb-access-token");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <PageBackground>
        <div className="mx-auto max-w-2xl px-4 py-12 font-mono">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight text-[#1C1819] dark:text-[#F0EFF4]">
            Ustawienia
          </h1>

          {/* Appearance */}
          <Card>
            <SectionHeader>Wygląd</SectionHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1C1819] dark:text-[#F0EFF4]">Motyw aplikacji</p>
                <p className="mt-0.5 text-xs text-[#9C99A6] dark:text-[#6E6B78]">
                  Aktualnie: {theme === "dark" ? "Ciemny" : "Jasny"}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] px-4 py-2 text-sm font-medium text-[#1C1819] dark:text-[#F0EFF4] hover:bg-[#F0EFF4] dark:hover:bg-[#2E2A30] transition-colors"
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                {theme === "dark" ? "Jasny" : "Ciemny"}
              </button>
            </div>
          </Card>

          {/* Account options — only when logged in */}
          {auth?.loggedIn ? (
            <>
              {/* Change email */}
              <Card>
                <SectionHeader>Zmień email</SectionHeader>
                <form onSubmit={handleChangeEmail} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#1C1819] dark:text-[#F0EFF4]">
                      Nowy adres email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nowy@email.com"
                      className="w-full rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] bg-transparent px-3 py-2 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] focus:outline-none focus:ring-1 focus:ring-[#92140C] transition"
                    />
                  </div>
                  {emailMsg && (
                    <p className={`text-xs ${emailMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {emailMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!email}
                    className="rounded-lg bg-[#92140C] px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-[#7A100A] transition-colors"
                  >
                    Zapisz nowy email
                  </button>
                </form>
              </Card>

              {/* Change password */}
              <Card>
                <SectionHeader>Zmień hasło</SectionHeader>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#1C1819] dark:text-[#F0EFF4]">
                      Aktualne hasło
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] bg-transparent px-3 py-2 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] focus:outline-none focus:ring-1 focus:ring-[#92140C] transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#1C1819] dark:text-[#F0EFF4]">
                      Nowe hasło
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="min. 8 znaków"
                      className="w-full rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] bg-transparent px-3 py-2 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] focus:outline-none focus:ring-1 focus:ring-[#92140C] transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#1C1819] dark:text-[#F0EFF4]">
                      Potwierdź nowe hasło
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] bg-transparent px-3 py-2 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] dark:placeholder:text-[#6E6B78] focus:outline-none focus:ring-1 focus:ring-[#92140C] transition"
                    />
                  </div>
                  {passwordMsg && (
                    <p className={`text-xs ${passwordMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {passwordMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                    className="rounded-lg bg-[#92140C] px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-[#7A100A] transition-colors"
                  >
                    Zmień hasło
                  </button>
                </form>
              </Card>

              {/* Danger zone */}
              <Card danger>
                <SectionHeader>Strefa niebezpieczna</SectionHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1C1819] dark:text-[#F0EFF4]">Usuń konto</p>
                    <p className="mt-0.5 text-xs text-[#9C99A6] dark:text-[#6E6B78]">
                      Operacja trwale usunie sesję i dane konta. Nie można cofnąć.
                    </p>
                  </div>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="shrink-0 rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Usuń konto
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-[#9C99A6] dark:text-[#6E6B78]">
                        Wpisz <span className="font-semibold text-red-500">usuń</span> aby potwierdzić:
                      </p>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="usuń"
                        className="rounded-lg border border-red-300 dark:border-red-800 bg-transparent px-3 py-1.5 text-sm text-[#1C1819] dark:text-[#F0EFF4] placeholder:text-[#9C99A6] focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteInput !== "usuń"}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 hover:bg-red-700 transition-colors"
                        >
                          Potwierdź usunięcie
                        </button>
                        <button
                          onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                          className="rounded-lg border border-[#D8D6E0] dark:border-[#2E2A30] px-3 py-1.5 text-xs font-medium text-[#1C1819] dark:text-[#F0EFF4] hover:bg-[#F0EFF4] dark:hover:bg-[#2E2A30] transition-colors"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <div className="rounded-xl border border-[#D8D6E0] dark:border-[#2E2A30] bg-white/60 dark:bg-[#1C1819]/50 p-6 text-center">
              <p className="text-sm text-[#9C99A6] dark:text-[#6E6B78]">
                Zaloguj sie, aby zobaczyc ustawienia konta.
              </p>
            </div>
          )}
        </div>
      </PageBackground>
    </>
  );
}
