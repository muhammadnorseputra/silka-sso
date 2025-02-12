"use client";

import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { RevokeAccess } from "src/app/actions/revoke-access";

export function DashboardHeader({ user }: any) {
  return (
    <header className="flex items-center justify-between border-b dark:border-gray-800 px-6 py-4">
      <div className="flex items-center">
        <Input
          type="search"
          placeholder="Search..."
          startContent={
            <MagnifyingGlassIcon className="text-default-400 size-6" />
          }
          className="w-64"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Button isIconOnly variant="light" aria-label="Notifications">
          <BellIcon className="size-6" />
        </Button>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              name="John Doe"
              size="sm"
              src={user?.data.picture}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p>
                Signed in as{" "}
                <span className="font-bold">{user?.data.level}</span>
              </p>
              <p>{user?.data.nama_lengkap}</p>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onPress={() => RevokeAccess()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
