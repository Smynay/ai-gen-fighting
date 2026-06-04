import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
}

export function Modal({ children, open, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
