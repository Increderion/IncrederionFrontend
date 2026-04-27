import { useState } from "react";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";

interface NavbarProps {
  loggedIn?: boolean;
}

export default function Navbar({ loggedIn = false }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const handleLoginClick = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="font-mono sticky top-0 z-50 w-full border-b border-[#D8D6E0] bg-[#F0EFF4]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <a href="/" className="italic text-xl font-semibold tracking-tight text-[#92140C]">
              Increderion
            </a>

            <a
              href="/rejestr"
              className="relative text-sm font-medium text-[#1C1819]/70 transition-colors hover:text-[#1C1819] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-[#92140C] after:transition-all hover:after:w-full"
            >
              Rejestr
            </a>
          </div>

          <UserMenu
            loggedIn={loggedIn}
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
          />
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
