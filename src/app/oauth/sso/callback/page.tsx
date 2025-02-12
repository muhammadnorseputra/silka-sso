"use client";
import { useEffect } from "react";
import { create } from "./actions";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@heroui/react";
export default function Page() {
  const query = useSearchParams();
  const code = query.get("code");
  useEffect(() => {
    create(code?.toString());
  }, [code]);
  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <CircularProgress label="Loading..." />
      </div>
    </>
  );
}
