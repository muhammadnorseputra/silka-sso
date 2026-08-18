"use client";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <Spinner
          classNames={{ label: "text-foreground mt-4" }}
          label="Please Wait ..."
          variant="spinner"
          color="current"
          size="lg"
        />
      </motion.div>
    </section>
  );
}
