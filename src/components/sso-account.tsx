"use client";

import { create } from "@/app/actions/type-account";
import useHash from "@/utils/useHash";
// import UserCircleIcon from "@heroicons/react/20/solid/UserCircleIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import { Spinner } from "@heroui/react";
// import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import React, { useTransition } from "react";

export default function SSOAccount() {
  const [isPending, startTransition] = useTransition();
  const currentHash = useHash();

  const handleAccount = (type: string) => {
    startTransition( async () => {
      await create(type, currentHash ?? "");
    })
  };
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => handleAccount("UMPEG")}
        className="group relative w-full flex items-center gap-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-4 text-left shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400 transition-colors group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-500/20 dark:group-hover:to-indigo-500/20">
          <UserGroupIcon className="w-5 h-5" />
        </span>
        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            Pengelola Kepegawaian
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Masuk sebagai administrator UMPEG
          </span>
        </span>
        {isPending && <Spinner variant="spinner" size="sm" color="current"/>}
        <svg
          className="ml-auto w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        
      </button>
    </>
  );
}
