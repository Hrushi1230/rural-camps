import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { loadGsap } from "@/lib/gsap";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let cleanup = () => {};
    void loadGsap().then(
      ({ gsap }) => {
        if (disposed) return;
        const ctx = gsap.context(
          () =>
            gsap.fromTo(
              node,
              { y: 42, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power4.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: node, start: "top 88%", once: true },
              },
            ),
          node,
        );
        cleanup = () => ctx.revert();
      },
    );
    return () => { disposed = true; cleanup(); };
  }, []);
  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
