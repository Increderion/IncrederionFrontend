import { useContext } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";

export default function Settings() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
      <PageBackground>
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
          <p className="font-mono text-sm text-[#9C99A6]">Settingsy tu będą jak coś!!@!#!@3213</p>
        </div>
      </PageBackground>
    </>
  );
}
