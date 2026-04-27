import { useContext } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";

export default function Home() {
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar loggedIn={auth?.loggedIn ?? false} />
    </>
  );
}
