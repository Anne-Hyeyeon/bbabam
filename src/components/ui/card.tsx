import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export function CardContainer({ children, className = "" }: CardContainerProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
}
