"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Skeleton } from "@heroui/react";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

function ShimmerSkeleton({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Skeleton className={`relative overflow-hidden ${shimmer} ${className}`}>
      {children}
    </Skeleton>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function Loading() {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center justify-center"
    >
      <div className="w-full sm:min-w-125">
        <Card className="rounded-3xl border border-white dark:border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-6 md:p-8">
          <CardBody>
            {/* Back button */}
            <ShimmerSkeleton className="rounded-lg mb-6 w-fit">
              <div className="h-8 w-32 bg-gray-300" />
            </ShimmerSkeleton>

            <div className="space-y-6">
              {/* DEVICE ID */}
              <div>
                <ShimmerSkeleton className="rounded-lg mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    DEVICE ID
                  </label>
                </ShimmerSkeleton>
                <ShimmerSkeleton className="rounded-lg">
                  <div className="block w-full py-3 border-b border-gray-300 bg-transparent" />
                </ShimmerSkeleton>
              </div>

              {/* NIP */}
              <div>
                <ShimmerSkeleton className="rounded-lg mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    NIP
                  </label>
                </ShimmerSkeleton>
                <ShimmerSkeleton className="rounded-lg">
                  <div className="block w-full py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </ShimmerSkeleton>
              </div>

              {/* Label Perangkat */}
              <div>
                <ShimmerSkeleton className="rounded-lg mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Label Perangkat - Nama Pengguna
                  </label>
                </ShimmerSkeleton>
                <ShimmerSkeleton className="rounded-lg">
                  <div className="block w-full py-3 border border-gray-300 rounded-lg bg-gray-50" />
                </ShimmerSkeleton>
              </div>

              {/* Readonly: IP / Browser / OS */}
              {["IP", "BROWSER", "OS (SISTEM OPERASI)"].map((label) => (
                <div key={label}>
                  <ShimmerSkeleton className="rounded-lg mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                  </ShimmerSkeleton>
                  <ShimmerSkeleton className="rounded-lg">
                    <div className="block w-full py-3 border-b border-gray-300 bg-transparent" />
                  </ShimmerSkeleton>
                </div>
              ))}

              {/* Simpan button */}
              <ShimmerSkeleton className="rounded-lg">
                <button
                  disabled
                  className="w-full bg-blue-500/70 text-white py-3 px-4 rounded-lg font-medium cursor-wait"
                >
                  Simpan
                </button>
              </ShimmerSkeleton>
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
