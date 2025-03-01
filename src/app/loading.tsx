"use client";
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <section className="flex items-center justify-center min-h-screen">
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label="spinner"
        variant="spinner"
        color="primary"
        size="lg"
      />
    </section>
  );
}
