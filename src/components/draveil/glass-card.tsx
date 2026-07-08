import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassCard({
  className,
  children,
  as: Tag = "div",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" }) {
  const Comp = Tag as "div";
  return (
    <Comp
      className={cn(
        "glass rounded-3xl p-5 transition-colors",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}