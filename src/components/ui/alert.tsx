import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[10px] border p-3 text-[13px] [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3 [&>svg]:text-[var(--color-ink-muted)] [&>svg~*]:pl-6",
  {
    variants: {
      variant: {
        default: "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
        info: "border-[var(--color-cat-blue)]/40 bg-[var(--color-cat-blue)]/20 text-[var(--color-ink)]",
        warn: "border-[var(--color-state-warn)]/40 bg-[var(--color-state-warn)]/15 text-[var(--color-ink)]",
        error: "border-[var(--color-state-error)]/40 bg-[var(--color-state-error)]/10 text-[var(--color-ink)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-[12px] leading-relaxed text-[var(--color-ink-muted)]", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";
