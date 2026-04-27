interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <div className={`relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#F0EFF4] ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#D8D6E0]/50 blur-3xl" />
        <div className="absolute top-1/4 -right-40 h-[520px] w-[520px] rounded-full bg-[#C8C6D4]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-[#D8D6E0]/45 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-[300px] w-[300px] rounded-full bg-[#BCBAC9]/35 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#E4E2EC]/30 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
