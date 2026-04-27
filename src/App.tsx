import { Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./auth-context";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Organizations from "./pages/Organizations";
import Settings from "./pages/Settings";

function LoggedInWrapper() {
  const auth = useContext(AuthContext);
  if (!auth) return <Navbar loggedIn={false} />;
  return <Navbar loggedIn={auth.loggedIn} />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoggedInWrapper />} />
        <Route path="/organizacje" element={<LoggedInWrapper />} />
        <Route path="/settings" element={<LoggedInWrapper />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;