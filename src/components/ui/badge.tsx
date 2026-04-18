import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-ink)] text-white",
        secondary: "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
        outline: "border-[var(--color-border)] text-[var(--color-ink-muted)]",
        primary: "border-transparent bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
