"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <>
      <Spinner className="mx-auto" color="current" variant="dots" size="lg" />
    </>
  );
}
