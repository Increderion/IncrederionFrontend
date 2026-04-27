import { useContext } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import CompanySearch from "../components/CompanySearch";

export default function Registry() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-[#1C1819] mb-2">
            Rejestr
          </h1>
          <p className="font-mono text-sm text-[#9C99A6] mb-10">
            Wyszukaj firmę po nazwie, numerze NIP lub KRS
          </p>
          <CompanySearch />
        </div>
      </main>
    </>
  );
}
