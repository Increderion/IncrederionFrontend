import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth-context";
import { ThemeProvider } from "./theme-context";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Registry = lazy(() => import("./pages/Registry"));
const Settings = lazy(() => import("./pages/Settings"));
const CompanyDetails = lazy(() => import("./pages/CompanyDetails"));

function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3EFF6] dark:bg-[#111013]">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D8D6E0] dark:border-[#2E2A38] border-t-[#92140C]" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rejestr" element={<Registry />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/firma/:id" element={<CompanyDetails />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
