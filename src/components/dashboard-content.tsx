"use client";

import { SSOAppGrid } from "@/components/sso-app-grid";

export function DashboardContent({ clients }: any) {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h1 className="text-2xl font-bold mb-6">SSO Applications</h1>
      <SSOAppGrid results={clients} />
    </main>
  );
}
