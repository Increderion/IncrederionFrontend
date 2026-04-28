import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth-context";
import { ThemeProvider } from "./theme-context";
import LandingPage from "./pages/LandingPage";
import Registry from "./pages/Registry";
import Settings from "./pages/Settings";
import CompanyDetails from "./pages/CompanyDetails";
import ReportDetails from "./pages/ReportDetails";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rejestr" element={<Registry />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/firma/:id" element={<CompanyDetails />} />
        <Route path="/raport/:id" element={<ReportDetails />} />
      </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
