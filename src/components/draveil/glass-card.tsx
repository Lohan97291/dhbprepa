import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassCard({
  className,
  children,
  as: Tag = "div",
  interactive = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  interactive?: boolean;
}) {
  const Comp = Tag as "div";
  return (
    <Comp
      className={cn(
        "glass rounded-3xl p-5 lift",
        interactive && "cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}