import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth-context";
import Navbar from "../components/Navbar";
import LoadingBar from "../components/LoadingBar";
import { fetchCompanyById } from "../api/companies";

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyById(id)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <LoadingBar loading={loading} />
      <Navbar loggedIn={auth?.loggedIn ?? false} />
    </>
  );
}
