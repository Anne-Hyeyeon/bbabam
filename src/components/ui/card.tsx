import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export function CardContainer({ children, className = "" }: CardContainerProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
}
