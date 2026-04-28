<h1> Sławek Kruszyński - Konrad Klautzsch - Matvii Hniezdilov - Wojtek Artymiak - Antoni Barczak - Oskar Kurzyna</h1>

DOKUMENTACJA FRONTENDU INCREDERION
1. Ogólny opis
Aplikacja frontendowa Increderion to narzędzie do weryfikacji wiarygodności polskich firm, wykrywania prania pieniędzy i analizy ryzyka KYC/AML. Wykorzystuje stos: React 19, TypeScript ~6.0, Vite 8, Tailwind CSS 4 i React Router 7. Komunikuje się z backendem NestJS (domyślnie http://localhost:3000), który proxy'uje zapytania do Supabase.
2. Struktura plików
increderionFrontend/
├── index.html                # Główny plik HTML, ładuje motyw z localStorage przed renderowaniem
├── vite.config.ts            # Konfiguracja Vite (pluginy: react, tailwindcss)
├── tsconfig.json             # Konfiguracja TypeScript (odwołania do tsconfig.app.json i tsconfig.node.json)
└── src/
    ├── main.tsx              # Punkt wejścia: montuje React w #root, otacza w StrictMode i BrowserRouter
    ├── App.tsx               # Definicja tras i opakowanie w ThemeProvider + AuthProvider
    ├── auth-context.tsx      # Kontekst autoryzacji (zarządzanie stanem zalogowania)
    ├── theme-context.tsx     # Kontekst motywu (jasny/ciemny)
    ├── index.css             # Główne style Tailwind
    ├── api/                  # Warstwa komunikacji z backendem
    │   ├── companies.ts      # Endpointy firmowe
    │   └── reports.ts       # Endpointy raportów
    ├── components/           # Współdzielone komponenty
    │   ├── Navbar.tsx        # Górny pasek nawigacyjny
    │   ├── AuthModal.tsx     # Modal logowania/rejestracji
    │   ├── UserMenu.tsx      # Menu użytkownika
    │   ├── CompanySearch.tsx # Wyszukiwarka firm z debounce
    │   ├── LoadingBar.tsx    # Pasek ładowania
    │   └── PageBackground.tsx # Tło stron
    └── pages/                # Strony odpowiadające trasom
        ├── LandingPage.tsx   # Strona główna
        ├── Registry.tsx      # Rejestr firm (wyszukiwanie)
        ├── Settings.tsx      # Ustawienia konta i motywu
        ├── CompanyDetails.tsx # Szczegóły firmy
        ├── ReportDetails.tsx # Szczegóły raportu
        └── ReportsLibrary.tsx # Biblioteka raportów
3. Routing (ścieżki aplikacji)
Zdefiniowane w src/App.tsx:
Ścieżka
/
/rejestr
/settings
/biblioteka
/firma/:id
/raport/:id
4. Konteksty (stan globalny)
auth-context.tsx (AuthContext)
- Przechowuje loggedIn (boolean) na podstawie obecności tokenu sb-access-token w localStorage
- Reaguje na zdarzenia storage (również w tej samej karcie), by odświeżyć stan po logowaniu/wylogowaniu
- Udostępnia setLoggedIn do ręcznej zmiany stanu
theme-context.tsx (ThemeContext)
- Przechowuje motyw (light/dark) w localStorage pod kluczem theme
- Przełącza klasę dark na elemencie <html> zależnie od motywu
- Udostępnia hook useTheme() do odczytu motywu i funkcji toggleTheme
5. Warstwa API (komunikacja z backendem)
Wszystkie zapytania kierowane są do VITE_API_URL (domyślnie http://localhost:3000). Każde zapytanie dodaje nagłówek Authorization: Bearer <token> jeśli użytkownik jest zalogowany (token pobierany z localStorage["sb-access-token"]).
src/api/companies.ts
Typy:
- CompanyRow: Dane firmy (id, name, nip, krs, regon, legal_form, industry, registry_sync_status itd.)
Funkcje:
- fetchCompanySearch(query: string): GET /companies/autocomplete/${query} – zwraca listę firm pasujących do zapytania
- fetchCompanyById(id: string): GET /companies/${id} – zwraca dane pojedynczej firmy
src/api/reports.ts
Typy:
- ReportFinding: Pojedyncze znalezisko raportu (category, severity, title, summary, url)
- EventPanel: Panel zdarzenia w raporcie (label, description, severity)
- ReportRow: Pełny raport (id, status, ai_summary, events_panels, findings, company)
Funkcje:
- createReport(query: string): POST /reports – tworzy nowy raport dla podanej firmy, zwraca { reportId }
- fetchReportById(id: string): GET /reports/${id} – pobiera pełny raport
- fetchUserReports(): GET /reports – pobiera listę wszystkich raportów zalogowanego użytkownika
6. Opis stron
LandingPage.tsx
Strona główna z nagłówkiem "Sprawdź wiarygodność każdej firmy w Polsce", opisem funkcji (wykrywanie prania pieniędzy, analiza ryzyka, powiązania) i przyciskiem przekierowującym do /rejestr.
Registry.tsx
Strona rejestru firm. Wyświetla nagłówek i komponent CompanySearch do wyszukiwania firm. Dostępna dla wszystkich, ale wyszukiwarka wymaga zalogowania.
Settings.tsx
Strona ustawień (tylko dla zalogowanych). Pozwala:
- Przełączać motyw jasny/ciemny
- Zmieniać adres email (w trybie UI, bez faktycznego wywołania backendu)
- Zmieniać hasło (walidacja długości i zgodności, brak integracji z backendem)
- Usunąć konto (usuwa token z localStorage i przekierowuje do strony głównej)
CompanyDetails.tsx
Wyświetla szczegóły firmy o podanym UUID (pobrane przez fetchCompanyById). Pokazuje:
- Nazwę, formę prawną, status synchronizacji z rejestrem
- Dane identyfikacyjne (NIP, KRS, REGON, branża, data rejestracji, prezes)
- Surowe dane z rejestru (markdown) i link do źródła
- Czas ostatniej synchronizacji
ReportDetails.tsx
Wyświetla szczegóły raportu KYC (pobrane przez fetchReportById). Odpytuje backend co 3 sekundy, jeśli raport jest w statusie pending lub running. Pokazuje:
- Status raportu (oczekujący, w toku, zakończony, błąd)
- Podsumowanie AI (jeśli dostępne)
- Panele zdarzeń (EventPanels) z podziałem na kategorie ryzyka
- Źródła i dowody (findings) z linkami do źródeł
ReportsLibrary.tsx
Wyświetla listę wszystkich raportów użytkownika (pobrane przez fetchUserReports) w formie siatki. Każda karta raportu zawiera status, nazwę firmy, skrót podsumowania i link do szczegółów (/raport/:id).
7. Opis komponentów
Navbar.tsx
Sticky pasek u góry strony. Wyświetla logo Increderion, linki do /rejestr, /biblioteka, /settings i komponent UserMenu. Przyjmuje prop loggedIn określający stan zalogowania.
AuthModal.tsx
Modal pojawiający się po kliknięciu logowania. Zawiera formularz email/hasło dla trybu logowania i rejestracji. Po poprawnym wywołaniu backendu (/auth/login lub /auth/register) zapisuje token do localStorage["sb-access-token"] i odświeża stan AuthContext.
UserMenu.tsx
Menu rozwijane w Navbarze. Dla niezalogowanych wyświetla przycisk "Zaloguj", dla zalogowanych – imię użytkownika i przycisk "Wyloguj" (usuwa token z localStorage i odświeża kontekst).
CompanySearch.tsx
Wyszukiwarka firm z debounce (opóźnienie zapytań). Korzysta z fetchCompanySearch, wyświetla listę wyników. Po wybraniu firmy nawiguje do /firma/:id. Zablokowana dla niezalogowanych użytkowników.
LoadingBar.tsx
Prosty pasek ładowania wyświetlany podczas pobierania danych (przyjmuje prop loading).
PageBackground.tsx
Komponent tła dla wszystkich stron – zawiera gradienty i stylizację tła dopasowaną do motywu.
8. Integracja z backendem – kluczowe informacje
- Backend wymaga tokenu JWT w nagłówku Authorization: Bearer <token>
- Frontend pobiera token z localStorage["sb-access-token"] (zapisuje go AuthModal po logowaniu)
- Raporty są generowane asynchronicznie: frontend odpytuje status co 3 sekundy aż do zakończenia
- Endpointy frontendu:
  - Firmy: GET /companies/autocomplete/:query, GET /companies/:id
  - Raporty: POST /reports, GET /reports, GET /reports/:id
- Zgodnie z dokumentacją backendu (CLAUDE.md) główne endpointy to POST /companies/search, ale frontend korzysta z /autocomplete – różnica wynika z aktualnej implementacji API.
