"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConfirmStore } from "@/stores/useConfirmStore";

export interface DeleteConfirmModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = (props) => {
  const store = useConfirmStore();

  const isControlled = props.isOpen !== undefined;
  const isOpen = isControlled ? Boolean(props.isOpen) : store.isOpen;
  const onClose = isControlled ? props.onClose : store.onCancel;
  const onConfirm = isControlled ? props.onConfirm : store.onConfirm;

  const title =
    props.title ||
    store.options.title ||
    (props.variant === "warning" || store.options.variant === "warning"
      ? "Confirm Action"
      : "Confirm Deletion");

  const message =
    props.message ||
    store.options.message ||
    "Are you sure you want to permanently delete this item? This action cannot be undone.";

  const itemName = props.itemName || store.options.itemName;
  const confirmText =
    props.confirmText ||
    store.options.confirmText ||
    (props.variant === "warning" || store.options.variant === "warning"
      ? "Confirm"
      : "Delete Permanently");

  const cancelText = props.cancelText || store.options.cancelText || "Cancel";
  const variant = props.variant || store.options.variant || "danger";
  const isLoading = props.isLoading || false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => !isLoading && onClose && onClose()}
      />

      {/* Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-[#0F0F14] border border-[#242430] rounded-2xl shadow-2xl p-6 z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Subtle Ambient Accent Glow */}
        <div
          className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
            isDanger ? "bg-red-500/15" : "bg-amber-500/15"
          }`}
        />

        {/* Close Button */}
        <button
          onClick={() => !isLoading && onClose && onClose()}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col gap-4">
          {/* Header Icon + Title */}
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${
                isDanger
                  ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/10"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/10"
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 pr-6">
              <h3 className="text-base font-bold text-white tracking-wide">
                {title}
              </h3>
              <p className="text-xs text-[#9D9DAE] mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#242430]/60 mt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onClose && onClose()}
              disabled={isLoading}
              className="text-xs px-4 py-2"
            >
              {cancelText}
            </Button>

            <Button
              type="button"
              variant={isDanger ? "danger" : "primary"}
              onClick={() => onConfirm && onConfirm()}
              isLoading={isLoading}
              disabled={isLoading}
              className={`text-xs px-4 py-2 font-bold shadow-lg ${
                isDanger
                  ? "bg-red-600 hover:bg-red-500 shadow-red-600/20"
                  : ""
              }`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
