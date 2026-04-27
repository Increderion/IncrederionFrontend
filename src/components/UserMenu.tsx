import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  loggedIn?: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function UserMenu({ loggedIn = false, onLoginClick, onRegisterClick }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sb-access-token");
    setIsMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#92140C] text-white hover:bg-[#7a0f0a]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-[#D8D6E0] bg-[#F0EFF4] shadow-md">
          {loggedIn ? (
            <>
              <a
                href="/settings"
                className="font-mono block px-4 py-2.5 text-sm text-[#1C1819] hover:bg-[#E4E2EC] transition-colors"
              >
                Ustawienia
              </a>
              <div className="mx-3 h-px bg-[#D8D6E0]" />
              <button
                onClick={handleLogout}
                className="font-mono block w-full px-4 py-2.5 text-left text-sm text-[#92140C] hover:bg-[#E4E2EC] transition-colors"
              >
                Wyloguj się
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
                className="font-mono block w-full px-4 py-2.5 text-left text-sm text-[#1C1819] hover:bg-[#E4E2EC] transition-colors"
              >
                Logowanie
              </button>
              <div className="mx-3 h-px bg-[#D8D6E0]" />
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRegisterClick();
                }}
                className="font-mono block w-full px-4 py-2.5 text-left text-sm text-[#1C1819] hover:bg-[#E4E2EC] transition-colors"
              >
                Rejestracja
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
