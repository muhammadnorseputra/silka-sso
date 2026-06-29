"use client";

import { create } from "@/app/actions/type-account";
import useHash from "@/utils/useHash";
import UserCircleIcon from "@heroicons/react/20/solid/UserCircleIcon"; // Added for personal account
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import { Spinner } from "@heroui/react";
import React, { useTransition } from "react";

// Reusable button component for account types
interface SsoAccountButtonProps {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: (type: string) => void; // Function to call when button is clicked, passing its type
  isPending: boolean;
}

const SsoAccountButton: React.FC<SsoAccountButtonProps> = ({
  type,
  title,
  description,
  icon,
  onClick,
  isPending,
}) => {
  return (
    <button
      disabled={isPending}
      onClick={() => onClick(type)} // Pass the type to the handler
      className="group relative w-full flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-linear-to-b dark:from-gray-600 dark:to-gray-900 px-5 py-4 text-left shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400 transition-colors group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-500/20 dark:group-hover:to-indigo-500/20">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{description}</span>
      </span>
      {isPending && <Spinner variant="spinner" size="sm" color="current"/>}
      <svg
        className="ml-auto w-4 h-4 text-gray-300 dark:text-gray-300 transition-transform group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

// Main SSOAccount component
export default function SSOAccount() {
  const [isPending, startTransition] = useTransition();
  const currentHash = useHash();

  const handleAccount = (type: string) => {
    startTransition( async () => {
      // Assuming create function supports the 'PERSONAL' type
      await create(type, currentHash ?? "");
    })
  };

  return (
    <>
      {/* UMPEG Account Button */}
      <SsoAccountButton
        type="UMPEG"
        title="Pengelola Kepegawaian"
        description="Masuk sebagai administrator UMPEG"
        icon={<UserGroupIcon className="w-5 h-5" />}
        onClick={handleAccount}
        isPending={isPending}
      />

      {/* PERSONAL Account Button (New) */}
      <SsoAccountButton
        type="PERSONAL"
        title="Akun Pribadi" // Placeholder title, adjust if needed
        description="Masuk dengan akun pribadi Anda" // Placeholder description, adjust if needed
        icon={<UserCircleIcon className="w-5 h-5" />} // Placeholder icon
        onClick={handleAccount}
        isPending={isPending}
      />
    </>
  );
}
