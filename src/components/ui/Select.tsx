import React, { SelectHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-[#9D9DAE]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={twMerge(
              clsx(
                "w-full bg-[#121217] text-[#F8F8FA] border border-[#242430] rounded-lg px-3.5 py-2.5 text-sm appearance-none outline-none transition-all duration-200 cursor-pointer pr-10",
                "focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C]/40",
                error && "border-[#EF4444] focus:border-[#EF4444]",
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121217] text-[#F8F8FA]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D9DAE] pointer-events-none" />
        </div>
        {error && <span className="text-xs text-[#EF4444] font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
