"use client";

import React, { useRef, useEffect } from "react";
import { ConfirmModalProps } from "../../data/types";

export default function ConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      data-ignore-outside
    >
      <div
        ref={modalRef}
        className="p-6 bg-white border-2 border-gray-200 rounded-lg w-80"
        style={{
          boxShadow:
            "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
        }}
      >
        <h2 className="mb-2 text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-white bg-gray-400 rounded-lg cursor-pointer hover:bg-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
