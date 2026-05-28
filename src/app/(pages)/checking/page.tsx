"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, Button } from "@heroui/react";

export default function Page() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const timer = window.setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}`;
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl shadow-xl border border-slate-200 dark:border-slate-800">
        <CardBody className="text-center space-y-8 p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-cyan-500 text-white">
            <ArrowPathIcon className="size-12 animate-spin" />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-cyan-600">
              Checking authorisasi halaman
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
              Sedang memeriksa otorisasi
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Halaman ini akan otomatis mengarahkan ke aplikasi tujuan dalam
              beberapa detik.
            </p>
          </div>

          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              Mengalihkan dalam {countdown} detik...
            </div>
            <Button
              color="primary"
              fullWidth
              onPress={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}`;
              }}>
              Lanjutkan sekarang
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
