"use client";

import ChipComponent from "@/components/chip";
import {
  ArrowRightEndOnRectangleIcon,
  CheckCircleIcon,
  FingerPrintIcon,
  LockClosedIcon,
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
      isFooterBlurred={false}
      fullWidth={false}
      shadow="lg"
      className="w-full max-w-xl border-x rounded-none min-h-screen border-white/20 dark:border-white/10 bg-white/10 dark:bg-blue-200/10 backdrop-blur-sm shadow-sm p-2 sm:p-6 md:px-18 md:pt-2 md:pb-0 ring-1 ring-white/60 dark:ring-white/10">
      <CardHeader className="*:w-full">
        <div className="flex flex-col">
          <div className="p-3 border border-white/20 rounded-full bg-transparent">
            <div className="p-3 border border-white/60 rounded-full bg-transparent">
              <div className="p-3 border border-white/90 rounded-full bg-white/30 dark:bg-blue-300/70 backdrop-blur-lg shadow-xl shadow-white dark:shadow-blue-300 inline-flex justify-start items-center gap-x-6 w-full">
                <LockOpenIcon className="size-12 text-gray-800 dark:text-white" />
                <span className="text-xl font-bold antialiased">
                  Authorize Access Account
                </span>
              </div>
            </div>
          </div>
          <Divider orientation="vertical" className="h-8 mx-auto bg-white" />
          <ChipComponent
            className="p-4 mx-auto"
            name={params.get("client_name")}
          />
          <p className="text-sm text-default-400 mt-4 dark:text-white/60">
            Izinkan untuk menggunakan akun silka anda.
          </p>
          <div className="flex justify-start items-center gap-x-6 mb-2 mt-2 py-2 px-4 border border-white/80 dark:bg-white/10 dark:border-black/10 rounded-2xl w-full bg-white/30 backdrop-blur-xl shadow">
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
          <ul className="mt-2 bg-white/20 py-3 rounded-2xl *:border-b *:border-white/50 dark:*:border-white/30 *:py-2 *:px-4 [&>*:last-child]:border-b-0">
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
          </ul>
        </div>
      </CardHeader>
      <CardBody>
        <Button
          onPress={handleIzin}
          fullWidth
          size="lg"
          isDisabled={isPending}
          variant="shadow"
          color="primary"
          radius="sm"
          className="font-bold group transition-all">
          {isPending ? (
            <Spinner
              color={resolvedTheme === "dark" ? "warning" : "default"}
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
        {/* <Button
          onPress={() => router.back()}
          fullWidth
          variant="solid"
          color="default"
          size="lg"
          className="font-bold mt-6">
          Batal
        </Button> */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-300 dark:border-gray-300"></div>
          <span className="px-4 text-gray-200">OR</span>
          <div className="grow border-t border-gray-300 dark:border-gray-300"></div>
        </div>
        <Button
          onPress={handleLogout}
          fullWidth
          isDisabled={isPending}
          variant="solid"
          color="danger"
          size="lg"
          radius="sm"
          className="font-bold">
          {isPending ? (
            <Spinner
              color={resolvedTheme === "dark" ? "warning" : "default"}
              variant="dots"
              size="sm"
            />
          ) : (
            "Logout Akun"
          )}
        </Button>
      </CardBody>
      <CardFooter className="flex flex-col md:flex-row items-center md:items-end justify-center dark:bg-transparent">
        <span className="text-gray-600 text-sm text-ellipsis">
          &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Balangan.
        </span>
      </CardFooter>
    </Card>
  );
}
