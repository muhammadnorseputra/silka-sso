"use client";

import { SSOAppCard } from "@/components/sso-app-card";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Image } from "@heroui/react";

export function SSOAppGrid({ results }: any) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.result.data.map((app: any) => (
        <SSOAppCard
          key={app.client_id}
          name={app.client_name}
          icon={
            app.client_logo_url ? (
              <Image
                src={app.client_logo_url}
                width={50}
                height={50}
                alt={app.client_name}
              />
            ) : (
              <ArrowTopRightOnSquareIcon className="size-8" />
            )
          }
          desc={app.client_deskripsi}
          url={app.base_uri}
        />
      ))}
    </div>
  );
}
