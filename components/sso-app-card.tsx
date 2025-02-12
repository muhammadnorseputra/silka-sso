"use client";

import { Card, CardBody, CardFooter, Button, Link } from "@heroui/react";

interface SSOAppCardProps {
  name: string;
  icon: React.ReactNode;
  desc?: string;
  url: string;
}

export function SSOAppCard({ name, icon, desc, url }: SSOAppCardProps) {
  return (
    <Card>
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-default-500">{desc}</p>
        </div>
        {icon}
      </CardBody>
      <CardFooter>
        <Button
          showAnchorIcon
          as={Link}
          variant="flat"
          color="primary"
          target="_blank"
          href={url}
          fullWidth>
          Kunjungi
        </Button>
      </CardFooter>
    </Card>
  );
}
