import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-pink-500 text-white hover:bg-pink-600",
  secondary: "bg-blue-500 text-white hover:bg-blue-600",
  outline: "border-2 border-pink-500 text-pink-500 hover:bg-pink-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
