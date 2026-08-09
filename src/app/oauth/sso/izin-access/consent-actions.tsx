"use client";

import { useState } from "react";
import type { ConsentApprovalResult } from "@/app/actions/approve-consent";

function ConsentSubmitButton({
  label,
  pendingLabel,
  className,
  pending,
  onClick,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
  pending: boolean;
  onClick?: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      aria-disabled={pending}
      disabled={pending}
      onClick={onClick}
      className={className}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{pendingLabel}</span>
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function ConsentActions({
  cancelAction,
  approveAction,
}: {
  cancelAction: () => Promise<void>;
  approveAction: (formData: FormData) => Promise<ConsentApprovalResult>;
}) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCancel = async () => {
    setIsPending(true);
    try {
      await cancelAction();
    } finally {
      setIsPending(false);
    }
  };

  const handleApprove = async () => {
    setErrorMessage("");
    setIsPending(true);

    try {
      const result = await approveAction(new FormData());

      if (!result.success) {
        setErrorMessage(result.error || "Gagal mengirim izin akses.");
        return;
      }

      if (result.redirectUri) {
        window.location.assign(result.redirectUri);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message || "Terjadi kesalahan saat mengirim izin akses."
          : "Terjadi kesalahan saat mengirim izin akses.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-300/40 dark:bg-rose-950/50 dark:text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <ConsentSubmitButton
            label="Batal"
            pendingLabel="Membatalkan..."
            onClick={handleCancel}
            pending={isPending}
            className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70 dark:border-emerald-50/15 dark:text-emerald-50/85 dark:hover:bg-emerald-50/10 dark:hover:text-white"
          />
        </div>

        <div className="flex-1">
          <ConsentSubmitButton
            label="Izinkan akses"
            pendingLabel="Memproses..."
            onClick={handleApprove}
            pending={isPending}
            className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm shadow-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          />
        </div>
      </div>
    </>
  );
}
