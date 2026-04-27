export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#F0EFF4] bg-[#F0EFF4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-semibold tracking-tight text-[#1C1819]">
            Increderion
          </span>

          <a
            href="/organizacje"
            className="relative text-sm font-medium text-[#1C1819] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-[#92140C]"
          >
            Organizations
          </a>
        </div>
      </div>
    </nav>
  );
}