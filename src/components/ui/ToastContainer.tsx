"use client";

import React from "react";
import { useUIStore } from "@/stores/useUIStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#E5A93C] shrink-0" />,
        };

        const borders = {
          success: "border-[#22C55E]/30",
          error: "border-[#EF4444]/30",
          info: "border-[#E5A93C]/30",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#14141A] border ${borders[toast.type]} rounded-xl shadow-xl shadow-black/60 text-sm text-[#F8F8FA] animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9D9DAE] hover:text-[#F8F8FA] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
