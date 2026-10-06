import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#9D9DAE]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                "w-full bg-[#121217] text-[#F8F8FA] border border-[#242430] rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none",
                icon && "pl-10",
                "placeholder:text-[#6B6B7B]",
                "focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C]/40",
                error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/40",
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-[#EF4444] font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-[#6B6B7B]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows = 4, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#9D9DAE]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={twMerge(
            clsx(
              "w-full bg-[#121217] text-[#F8F8FA] border border-[#242430] rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none resize-y",
              "placeholder:text-[#6B6B7B]",
              "focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C]/40",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/40",
              className
            )
          )}
          {...props}
        />
        {error && <span className="text-xs text-[#EF4444] font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Input;
