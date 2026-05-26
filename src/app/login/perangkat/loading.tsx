"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <>
      <Spinner className="mx-auto" color="primary" variant="dots" size="lg" />
    </>
  );
}
