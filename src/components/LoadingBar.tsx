import { useEffect, useState } from "react";

interface LoadingBarProps {
  loading: boolean;
}

export default function LoadingBar({ loading }: LoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (loading) {
      setDone(false);
      setVisible(true);
      setProgress(0);

      const t1 = setTimeout(() => setProgress(35), 30);
      const t2 = setTimeout(() => setProgress(65), 500);
      const t3 = setTimeout(() => setProgress(85), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setProgress(100);
      setDone(true);
      const t = setTimeout(() => setVisible(false), 450);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none">
      <div
        className="h-full bg-[#92140C] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: done ? "200ms" : progress <= 35 ? "250ms" : progress <= 65 ? "600ms" : "1500ms",
          opacity: done ? 0 : 1,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}
