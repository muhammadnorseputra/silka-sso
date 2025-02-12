"use client";

import {
  Cog6ToothIcon,
  FingerPrintIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Card, CardBody, Button } from "@heroui/react";
import Link from "next/link";

export function DashboardSidebar() {
  return (
    <Card className="h-full w-60 rounded-none">
      <CardBody className="flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4 py-4 text-center">
          <FingerPrintIcon className="size-12 text-gray-300 mx-auto" />
          <span className="text-blue-600">SSO</span>{" "}
          <span className="text-gray-300">Console</span>
        </h2>
        <Button
          as={Link}
          href="/dashboard"
          startContent={<HomeIcon className="size-6" />}
          variant="light"
          className="justify-start">
          Home
        </Button>
        <Button
          as={Link}
          href="/users"
          startContent={<UserGroupIcon className="size-6" />}
          variant="light"
          className="justify-start">
          Users
        </Button>
        <Button
          as={Link}
          href="/settings"
          startContent={<Cog6ToothIcon className="size-6" />}
          variant="light"
          className="justify-start">
          Settings
        </Button>
      </CardBody>
    </Card>
  );
}
