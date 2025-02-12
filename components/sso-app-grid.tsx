"use client";

import { SSOAppCard } from "@/components/sso-app-card";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

const ssoApps = [
  {
    name: "SIMPUN",
    icon: <ArrowTopRightOnSquareIcon className="size-8" />,
    desc: "Sistem Informasi Pengelolaan Pensiun",
    url: "http://localhost:8000/",
  },
  {
    name: "SILKa - Inexis",
    icon: <ArrowTopRightOnSquareIcon className="size-8" />,
    desc: "Integrasi Layanan Kepegawaian dan Keuangan",
    url: "/",
  },
  {
    name: "SILKa Online",
    icon: <ArrowTopRightOnSquareIcon className="size-8" />,
    desc: "Portal Layanan Kepegawaian",
    url: "/",
  },
];

export function SSOAppGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ssoApps.map((app) => (
        <SSOAppCard
          key={app.name}
          name={app.name}
          icon={app.icon}
          desc={app.desc}
          url={app.url}
        />
      ))}
    </div>
  );
}
