import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth-context";
import Home from "./pages/Home";
import Registry from "./pages/Registry";
import Settings from "./pages/Settings";
import CompanyDetails from "./pages/CompanyDetails";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rejestr" element={<Registry />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/firma/:id" element={<CompanyDetails />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
