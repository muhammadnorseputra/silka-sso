"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Chip, Skeleton } from "@heroui/react";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

/** Wrapper agar skeleton punya positioned parent untuk shimmer overlay */
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header — Logo + Chip + Title + subtitle (mirip login.tsx) */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <ShimmerSkeleton className="rounded-full">
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
          </ShimmerSkeleton>
        </div>

        <ShimmerSkeleton className="rounded-full mx-auto mb-3">
          <Chip color="warning" size="sm" variant="flat" className="px-3">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Chip>
        </ShimmerSkeleton>

        <ShimmerSkeleton className="rounded-lg">
          <h3 className="text-3xl font-display font-bold">Single Sign-On</h3>
        </ShimmerSkeleton>

        <ShimmerSkeleton className="rounded-lg mt-2">
          <p className="font-display font-semibold tracking-wide">
            Sistem Informasi Layanan Kepegawaian
          </p>
        </ShimmerSkeleton>
      </motion.div>

      {/* Main Card — MagicCard + form (mirip login.tsx) */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className="w-full max-w-xl px-2 sm:px-8"
      >
        <Card className="w-full shadow-none bg-transparent">
          <CardBody className="p-0 bg-transparent">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-linear-to-b dark:from-slate-800 dark:to-black p-8">
              <div className="flex flex-col space-y-6">
                {/* Username — variant underlined */}
                <div>
                  <ShimmerSkeleton className="rounded-lg mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                  </ShimmerSkeleton>
                  <ShimmerSkeleton className="rounded-lg">
                    <div className="block w-full py-3 border-b border-gray-300 bg-transparent" />
                  </ShimmerSkeleton>
                </div>

                {/* Password — variant underlined */}
                <div>
                  <ShimmerSkeleton className="rounded-lg mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                  </ShimmerSkeleton>
                  <ShimmerSkeleton className="rounded-lg">
                    <div className="block w-full py-3 border-b border-gray-300 bg-transparent" />
                  </ShimmerSkeleton>
                </div>

                {/* Button — "Masuk Sekarang" */}
                <ShimmerSkeleton className="rounded-lg">
                  <button
                    disabled
                    className="w-full bg-blue-500/70 text-white py-3 px-4 rounded-lg font-medium cursor-wait"
                  >
                    Masuk Sekarang
                  </button>
                </ShimmerSkeleton>

                {/* Links — "Lupa Password? Reset di sini" */}
                <div className="flex justify-start items-center">
                  <ShimmerSkeleton className="rounded-lg">
                    <span className="text-sm text-gray-500">
                      Lupa Password? Reset di sini
                    </span>
                  </ShimmerSkeleton>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <ShimmerSkeleton className="rounded-lg">
          <p className="text-sm text-gray-500">
            © 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Kab. Balangan.
          </p>
        </ShimmerSkeleton>
      </motion.div>
    </div>
  );
}
