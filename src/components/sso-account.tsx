"use client";

import { create } from "@/app/actions/type-account";
import useHash from "@/utils/useHash";
// import UserCircleIcon from "@heroicons/react/20/solid/UserCircleIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
// import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import { Button } from "@heroui/react";

export default function SSOAccount() {
  const currentHash = useHash();

  const handleAccount = (type: string) => {
    create(type, currentHash ?? "");
  };
  return (
    <>
      <Button
        className="py-8 hover:shadow-xl hover:scale-110"
        fullWidth
        size="lg"
        variant="ghost"
        color="danger"
        disableRipple={true}
        startContent={<UserGroupIcon />}
        onPress={() => handleAccount("UMPEG")}>
        Masuk sebagai Pengelola Kepegawaian - UMPEG
      </Button>
      {/* <Button
        className="py-8 hover:shadow-xl hover:scale-110"
        fullWidth
        size="lg"
        variant="ghost"
        color="success"
        disableRipple={true}
        startContent={<UserCircleIcon />}
        onPress={() => handleAccount("PNS")}>
        Masuk sebagai Personal - PNS
      </Button> */}
      {/* <Button
        className="py-8 hover:shadow-xl hover:scale-110"
        fullWidth
        size="lg"
        variant="ghost"
        color="primary"
        disableRipple={true}
        startContent={<UsersIcon />}
        onPress={() => handleAccount("NONASN")}>
        Masuk sebagai Personal - NON ASN
      </Button> */}
    </>
  );
}
