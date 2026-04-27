import { useContext } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />

      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#F0EFF4]">
        {/* decorative circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#D8D6E0]/50 blur-3xl" />
          <div className="absolute top-1/4 -right-40 h-[520px] w-[520px] rounded-full bg-[#C8C6D4]/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-[#D8D6E0]/45 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-[300px] w-[300px] rounded-full bg-[#BCBAC9]/35 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#E4E2EC]/30 blur-3xl" />
        </div>

        {/* content */}
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
          <p className="font-mono mb-4 text-xs font-medium uppercase tracking-widest text-[#92140C]">
            Rejestr polskich firm
          </p>

          <h1 className="font-mono mb-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#1C1819] sm:text-5xl">
            Sprawdź wiarygodność<br />
            każdej firmy w Polsce
          </h1>

          <p className="font-mono mb-10 max-w-lg text-sm leading-relaxed text-[#9C99A6]">
            Increderion to szybkie narzędzie do weryfikacji firm — wyszukuj po nazwie, NIP lub KRS i uzyskaj kluczowe informacje w kilka sekund.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="/rejestr"
              className="font-mono inline-flex items-center gap-2 rounded-md bg-[#92140C] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#7a0f0a] transition-colors"
            >
              Przeszukaj rejestr
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl w-full">
            {[
              { label: "Wyszukiwanie po nazwie", desc: "Znajdź firmę wpisując jej pełną lub częściową nazwę" },
              { label: "Weryfikacja NIP / KRS", desc: "Szybka weryfikacja numeru identyfikacyjnego" },
              { label: "Szczegółowe dane", desc: "Adres, status, forma prawna i więcej" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#E4E2EC] bg-white/60 p-5 text-left backdrop-blur-sm"
              >
                <p className="font-mono mb-1 text-sm font-semibold text-[#1C1819]">{item.label}</p>
                <p className="font-mono text-xs leading-relaxed text-[#9C99A6]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
