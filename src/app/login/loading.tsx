"use client";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { EyeIcon, FingerPrintIcon, KeyIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, Skeleton, Chip } from "@heroui/react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skeleton className="rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800">Single Sign-On</h1>
          </Skeleton>
          <Skeleton className="rounded-full">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <FingerPrintIcon className="w-8 h-8 text-gray-400" />
            </div>
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg">
          <p className="text-lg text-gray-600">
            Sistem Informasi Layanan Kepegawaian
          </p>
        </Skeleton>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-lg shadow-xl bg-transparent">
        <CardBody className="p-8 bg-transparent">
          {/* Info Text with Badge */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Skeleton className="rounded-lg">
                <span className="text-gray-600">Gunakan AKUN</span>
              </Skeleton>
              <Skeleton className="rounded-full">
                <Chip color="success" variant="flat" className="bg-purple-500">
                  UMPEG
                </Chip>
              </Skeleton>
              <Skeleton className="rounded-lg">
                <span className="text-gray-600">
                  untuk mengakses berbagai layanan kepegawaian.
                </span>
              </Skeleton>
            </div>
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <Skeleton className="rounded-lg mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-400">Enter your username</span>
                </div>
              </div>
            </Skeleton>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <Skeleton className="rounded-lg mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-400">Enter your password</span>
                </div>
              </div>
            </Skeleton>
          </div>

          {/* Login Button */}
          <Skeleton className="rounded-lg mb-6">
            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium">
              Login Sekarang
            </button>
          </Skeleton>

          {/* Footer Links */}
          <div className="flex justify-between items-center">
            <Skeleton className="rounded-lg">
              <button className="text-pink-500 text-sm flex items-center gap-1">
                <span>{"<"}</span> Back
              </button>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <button className="text-blue-500 text-sm">
                Lupa atau ganti password ?
              </button>
            </Skeleton>
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Skeleton className="rounded-lg">
          <p className="text-sm text-gray-500">
            © 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Kab. Balangan.
          </p>
        </Skeleton>
      </div>
    </div>
  );
}
