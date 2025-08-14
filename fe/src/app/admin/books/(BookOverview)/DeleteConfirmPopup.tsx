'use client';
import React from 'react';
import DeleteIcon from '@/icons/DeleteIcon.svg';
import { useDeleteBook } from '@/hooks/CRUD/useDeleteBook';

import { useState } from 'react';
type DeleteConfirmPopupProps = {
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void; // bạn xử lý xóa ở ngoài
  id: string;
};

export default function DeleteConfirmPopup({
  title = 'Delete Confirmation',
  message = 'Are you certain you wish to proceed with the deletion of the selected entry?',
  onCancel,
  onConfirm,
  id,
}: DeleteConfirmPopupProps) {
  const { mutate, mutateAsync, isPending, error } = useDeleteBook();
  async function onSubmit() {
    await mutateAsync({ id });
    onConfirm();
  }
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 grid place-items-center z-50"
        onClick={onCancel} // click ra ngoài để đóng
      >
        <div
          className="bg-white rounded-lg shadow-lg w-[420px] p-6 relative"
          onClick={(e) => e.stopPropagation()} // chặn close khi click trong card
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 p-2 rounded">
                <DeleteIcon className="w-6 h-6 text-black" />
              </div>
              <h2 className="font-semibold text-lg">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
          <hr className="border-gray-300 mb-6" />

          {/* Body */}
          <p className="text-gray-600 text-sm mb-5">“{message}”</p>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="min-w-[200px] py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 disabled:opacity-70"
            >
              {isPending ? 'PROCESSING…' : 'CONFIRM'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
