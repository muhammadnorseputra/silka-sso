"use client";

import {
  ArrowRightEndOnRectangleIcon,
  CheckCircleIcon,
  FingerPrintIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { create } from "src/app/actions/izin-layar";
import { logout } from "src/app/actions/logout";

interface Payload extends JwtPayload {
  data: any;
}

export default function IzinLayar({ access_token, clientId }: any) {
  const params = useSearchParams();
  const router = useRouter();

  // access_token
  const access_token_decode = jwtDecode<Payload>(access_token);
  const { nip } = access_token_decode.data;

  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (isPending) return;
    // THIS CODE WILL RUN AFTER THE SERVER ACTION
  }, [isPending]);

  const handleIzin = async () => {
    // RUN SOME VALIDATION HERE
    startTransition(async () => {
      const createIzin = await create(clientId);
      if (createIzin.status === false) {
        toast.error(createIzin.message);
      }
    });
  };

  const handleLogout = async () => {
    // RUN SOME VALIDATION HERE

    startTransition(() => {
      return logout(nip, clientId, access_token);
    });
  };
  return (
    <>
      <Card
        isFooterBlurred
        fullWidth={false}
        shadow="sm"
        className="px-4 md:px-8 py-3 md:py-6 md:max-w-lg lg:max-w-md border border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-900/70 backdrop-blur-xl">
        <CardHeader>
          <div className="flex flex-col">
            <h3 className="text-3xl fw-bold flex items-center justify-start gap-x-3">
              Access Permission{" "}
              <FingerPrintIcon className="size-12 text-gray-300" />
            </h3>
            <p className="text-lg text-default-400 mt-4 dark:text-white/70">
              Izinkan{" "}
              <span className="text-xl font-bold text-blue-400">
                {params.get("client_name")}
              </span>{" "}
              untuk menggunakan akun silka anda.
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="text-green-600 size-5" />
                <span>Nomor Induk Pegawai (NIP)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="text-green-600 size-5" />
                <span>Nama Lengkap</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="text-green-600 size-5" />
                <span>Photo Profile</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="text-green-600 size-5" />
                <span>Info kepegawaian.</span>
              </li>
            </ul>
          </div>
        </CardHeader>
        <CardBody>
          <Button
            onPress={handleIzin}
            fullWidth
            size="lg"
            isLoading={isPending}
            isDisabled={isPending}
            variant="shadow"
            color="primary"
            className="font-bold">
            {isPending ? (
              ""
            ) : (
              <>
                Lanjutkan
                <ArrowRightEndOnRectangleIcon className="size-6" />
              </>
            )}
          </Button>
          <Button
            onPress={() => router.back()}
            fullWidth
            variant="solid"
            color="default"
            size="lg"
            className="font-bold mt-6">
            Batal
            <XCircleIcon className="size-6" />
          </Button>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button
            onPress={handleLogout}
            fullWidth
            isLoading={isPending}
            isDisabled={isPending}
            variant="solid"
            color="danger"
            size="lg"
            className="font-bold">
            {isPending ? "" : "Logout Akun"}
          </Button>
        </CardBody>
        <CardFooter className="flex flex-col md:flex-row items-center md:items-end justify-between dark:bg-transparent">
          <span className="text-gray-300 text-sm text-ellipsis">
            &copy; Dikembangakan oleh Bidang PPIK.
          </span>
        </CardFooter>
      </Card>
    </>
  );
}
