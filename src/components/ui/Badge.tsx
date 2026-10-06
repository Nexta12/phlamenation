import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "success" | "warning" | "danger" | "neutral" | "outline" | "default" | "destructive";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  size = "md",
  className,
}) => {
  const variants: Record<string, string> = {
    gold: "bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/30",
    success: "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30",
    danger: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
    destructive: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
    neutral: "bg-[#1A1A22] text-[#9D9DAE] border border-[#242430]",
    outline: "bg-transparent text-[#9D9DAE] border border-[#242430]",
    default: "bg-[#1A1A22] text-[#F8F8FA] border border-[#242430]",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-full select-none",
          variants[variant] || variants.default,
          sizes[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
