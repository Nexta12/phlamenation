import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "icon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "sm",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer rounded-lg";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#E5A93C] to-[#D4952B] hover:from-[#F3C772] hover:to-[#E5A93C] text-[#08080A] font-semibold shadow-md shadow-[#E5A93C]/10 border border-[#F3C772]/20",
      secondary:
        "bg-[#1A1A22] hover:bg-[#242430] text-[#F8F8FA] border border-[#242430]",
      outline:
        "border border-[#E5A93C]/40 text-[#E5A93C] hover:bg-[#E5A93C]/10 hover:border-[#E5A93C]",
      ghost:
        "text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-[#1A1A22]",
      danger:
        "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm",
      icon:
        "p-2 text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-[#1A1A22] rounded-full",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
    };

    const sizeClass = variant === "icon" ? "" : sizes[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizeClass, className))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
