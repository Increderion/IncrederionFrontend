import { useContext } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import CompanySearch from "../components/CompanySearch";
import PageBackground from "../components/PageBackground";

export default function Registry() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <PageBackground>
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl mx-auto text-center">
            <p className="font-mono mb-4 text-xs font-medium uppercase tracking-widest text-[#92140C]">
              Baza danych firm
            </p>
            <h1 className="font-mono text-4xl font-bold tracking-tight text-[#1C1819] mb-3">
              Rejestr
            </h1>
            <p className="font-mono text-sm text-[#9C99A6] mb-10 max-w-md mx-auto leading-relaxed">
              Wyszukaj firmę i sprawdź jej profil ryzyka — analiza AML, powiązania kapitałowe i scoring wiarygodności.
            </p>
            <CompanySearch />
          </div>
        </div>
      </PageBackground>
    </>
  );
}
