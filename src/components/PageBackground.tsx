interface PageBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <div
      className={`relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-[#F3EFF6] via-[#F1EEF3] to-[#F6F0ED] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.35] noise-texture" />

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-[#F07848]/20 blur-3xl" />
        <div className="absolute -top-16 -right-32 h-[520px] w-[520px] rounded-full bg-[#7E78B4]/9 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-[440px] w-[440px] rounded-full bg-[#E86030]/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-[400px] w-[400px] rounded-full bg-[#9490C8]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[#C8C4E0]/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-[220px] w-[220px] rounded-full bg-[#F09060]/16 blur-2xl" />
        <div className="absolute -top-10 left-1/3 h-[280px] w-[280px] rounded-full bg-[#92140C]/10 blur-3xl" />
        <div className="absolute top-1/2 -left-10 h-[260px] w-[260px] rounded-full bg-[#F08050]/18 blur-2xl" />
        <div className="absolute top-2/3 right-1/3 h-[200px] w-[200px] rounded-full bg-[#6860A8]/7 blur-2xl" />
        <div className="absolute -bottom-8 left-1/2 h-[300px] w-[300px] rounded-full bg-[#E8A040]/12 blur-3xl" />
        <div className="absolute top-1/4 left-1/2 h-[180px] w-[180px] rounded-full bg-[#A09CC8]/10 blur-2xl" />
        <div className="absolute top-3/4 left-1/4 h-[240px] w-[240px] rounded-full bg-[#F06A30]/13 blur-3xl" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
