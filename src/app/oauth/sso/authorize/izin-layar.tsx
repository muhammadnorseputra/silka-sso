"use client";

import ChipComponent from "@/components/chip";
import { KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import {
  ArrowRightEndOnRectangleIcon,
  CheckCircleIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Spinner,
  Divider,
} from "@heroui/react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { create } from "src/app/actions/izin-layar";
import { logout } from "src/app/actions/logout";

interface Payload extends JwtPayload {
  data: any;
}

export default function IzinLayar({
  access_token,
  state,
  clientId,
  redirectUri,
}: any) {
  const { resolvedTheme } = useTheme();

  // get parameter
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // cek parameter scope apakah ada atau tidak
  const scope = params.get("scope") ? `&scope=${params.get("scope")}` : "";

  const parameter = `${pathname}?client_name=${params.get(
    "client_name",
  )}${scope}&client_id=${params.get(
    "client_id",
  )}&redirect_uri=${encodeURIComponent(
    params.get("redirect_uri") as string,
  )}&response_type=${params.get("response_type")}&state=${state}`;

  // access_token
  const access_token_decode = jwtDecode<Payload>(access_token);
  const { nip, nama_lengkap, picture } = access_token_decode.data;

  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (isPending) return;
    // THIS CODE WILL RUN AFTER THE SERVER ACTION
  }, [isPending]);

  const handleIzin = async () => {
    // RUN SOME VALIDATION HERE
    startTransition(async () => {
      const createIzin = await create(
        clientId,
        state,
        params.get("scope") as string,
        redirectUri,
      );
      if (createIzin.status === false) {
        toast.error(createIzin.message);
      }
    });
  };

  const handleLogout = async () => {
    // RUN SOME VALIDATION HERE
    startTransition(() => {
      return logout(nip, clientId, access_token, parameter);
    });
  };
  return (
    <Card
      fullWidth={true}
      shadow="none"
      radius="none"
      className="relative w-full max-w-xl min-h-screen px-2 sm:px-8 bg-transparent"
    >
      <CardHeader>
        <div className="inline-flex flex-col justify-center items-center w-full">
          <div className="p-3 border border-white/20 rounded-full bg-transparent">
            <div className="p-3 border border-white/60 rounded-full bg-transparent">
              <div className="p-3 border border-white/90 rounded-full bg-white/30 dark:bg-blue-300/70 backdrop-blur-lg shadow-xl shadow-white dark:shadow-blue-300 inline-flex justify-start items-center gap-x-6 w-full">
                <KeyIcon className="size-12 text-gray-800 dark:text-white" />
              </div>
            </div>
          </div>
          <Divider orientation="vertical" className="h-4 mx-auto bg-white/20" />
          <ChipComponent
            className="p-4 mx-auto"
            name={params.get("client_name")}
          />
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-default-400 dark:text-white/60">
          Izinkan untuk menggunakan akun silka anda.
        </p>
        <div className="flex justify-start items-center gap-x-6 mb-2 mt-2 py-2 px-4 border border-white/90 dark:bg-white/20 dark:border-black/10 rounded-2xl w-full bg-white/60 backdrop-blur-xl shadow">
          <Avatar
            isBordered
            as="button"
            name={nama_lengkap}
            size="md"
            src={picture}
            className="w-16 h-16"
          />
          <div className="inline-flex flex-col items-start justify-start w-max">
            <span>{nama_lengkap}</span>
            <span>{nip}</span>
          </div>
        </div>
        {/* <ul className="mt-2 bg-white/20 py-3 rounded-2xl *:border-b *:border-white/50 dark:*:border-white/30 *:py-2 *:px-4 [&>*:last-child]:border-b-0">
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="text-green-600 dark:text-green-200 size-5" />
              <span>Nomor Induk Pegawai (NIP)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="text-green-600 dark:text-green-200 size-5" />
              <span>Nama Lengkap</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="text-green-600 dark:text-green-200 size-5" />
              <span>Photo Profile</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircleIcon className="text-green-600 dark:text-green-200 size-5" />
              <span>Info kepegawaian.</span>
            </li>
          </ul> */}
        <div className="inline-flex w-full justify-between items-center space-x-4">
           <Button
          onPress={handleLogout}
          fullWidth
          isDisabled={isPending}
          variant="flat"
          color="danger"
          size="lg"
          radius="sm"
          className="font-bold"
        >
          {isPending ? (
            <Spinner
              color={resolvedTheme === "dark" ? "default" : "default"}
              variant="spinner"
              size="sm"
            />
          ) : (
            <>
              Keluar
              <LockClosedIcon className="size-8" />
            </>
          )}
        </Button>
        <Button
          onPress={handleIzin}
          fullWidth
          size="lg"
          isDisabled={isPending}
          variant="shadow"
          color="primary"
          radius="sm"
          className="font-bold group transition-all"
        >
          {isPending ? (
            <Spinner
              color={resolvedTheme === "dark" ? "default" : "default"}
              variant="dots"
              size="sm"
            />
          ) : (
            <>
              Lanjutkan
              <ArrowRightEndOnRectangleIcon className="size-8" />
            </>
          )}
        </Button>
        </div>
        {/* <Button
          onPress={() => router.back()}
          fullWidth
          variant="solid"
          color="default"
          size="lg"
          className="font-bold mt-6">
          Batal
        </Button> */}
        {/* <div className="flex items-center my-4">
          <div className="grow border-t border-gray-300 dark:border-gray-300"></div>
          <span className="px-4 text-gray-200">OR</span>
          <div className="grow border-t border-gray-300 dark:border-gray-300"></div>
        </div> */}
      </CardBody>
      <CardFooter className="flex flex-col md:flex-row items-center md:items-end justify-center dark:bg-transparent">
        <span className="text-black/40 dark:text-white/40 text-sm text-center w-full">
          &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Balangan.
        </span>
      </CardFooter>
    </Card>
  );
}
