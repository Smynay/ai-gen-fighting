import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string;
}

const variantStyles = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500",
  secondary:
    "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
  danger:
    "bg-red-700 hover:bg-red-600 text-white border-red-600",
  ghost:
    "bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600",
};

const sizeStyles = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  title,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg font-semibold border transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}`}
    >
      {children}
    </button>
  );
}
