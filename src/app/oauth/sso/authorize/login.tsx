"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Tooltip,
  Spinner,
  Alert,
  CardFooter,
  Divider,
} from "@heroui/react";
import Link from "next/link";
import {
  ArrowRightCircleIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  KeyIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { permanentRedirect, useRouter } from "next/navigation";
import AuthVerify from "@/data/auth-actions";
import { v4 as uuidv4 } from "uuid";
import ChipComponent from "@/components/chip";

import { useReCaptcha } from "next-recaptcha-v3";
import { useTheme } from "next-themes";
import TwoFactorModal from "@/components/mfa-modal";

export default function Login({
  client,
  state = uuidv4(),
  scope,
  redirectUri = `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}/${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK as string}`,
  typeAccount,
}: any) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();
  const [isVisible, setIsVisible] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm();

  function toggleVisibility() {
    return setIsVisible(!isVisible);
  }

  const isSubmit = async (FormFileds: any) => {
    try {
      setLoadingBtn(true);
      // Generate ReCaptcha token
      const token = await executeRecaptcha("form_submit");

      const payload = {
        token,
        ...FormFileds,
        scope,
        client_id:
          client?.data.client_id ?? "5aa888ec-92be-4fdf-8c69-8c96e99e11ff",
        client_secret:
          client?.data.client_secret ??
          "+51jett5h))zpfhvwhej*r8_0%nej9ljx=*df0_b&2ss3wix*p",
        state,
      };

      const result = await toast.promise(AuthVerify(payload), {
        loading: "Memverifikasi akun...",
        success: (result) => {
          if (!result.response.status) {
            throw new Error(result.response.message);
          }

          return result.response.message;
        },
        error: (err) => err.message || "Terjadi kesalahan saat verifikasi",
      });

      if (result?.response.status) {
        permanentRedirect(
          `${redirectUri}?state=${state}&code=${result?.response.data.code}`,
        );
      }
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <>
      {/* <TwoFactorModal /> */}
      <Card
        fullWidth={true}
        isBlurred
        shadow="none"
        radius="sm"
        className="relative w-full max-w-xl border-x rounded-none min-h-screen border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/10 backdrop-blur-sm shadow-sm p-2 sm:p-6 md:px-18 md:pt-2 md:pb-0 ring-1 ring-white/60 dark:ring-white/10">
        <CardHeader className="flex flex-col">
          <div className="p-3 border border-white/20 rounded-full bg-transparent">
            <div className="p-3 border border-white/60 rounded-full bg-transparent">
              <div className="p-3 border border-white/90 rounded-full bg-white/30 dark:bg-blue-300/70 backdrop-blur-lg shadow-xl shadow-white dark:shadow-blue-300">
                <FingerPrintIcon className="size-12 text-gray-800 dark:text-white" />
              </div>
            </div>
          </div>
          <Divider
            orientation="vertical"
            className="h-8 mx-auto bg-white dark:bg-white/20"
          />
          <ChipComponent name={typeAccount} />
          <h3 className="text-3xl fw-bold flex items-center justify-center gap-x-3 mt-4">
            Single Sign-On{" "}
          </h3>
          <p className="font-bold">Sistem Informasi Layanan Kepegawaian</p>
          <div className="flex items-center justify-center w-full mt-6">
            <Alert
              color="warning"
              description="Silahkan gunakan akun anda untuk mengakses
            layanan kepegawaian."
              variant="flat"
              radius="sm"
            />
          </div>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(isSubmit)}
            method="POST"
            autoComplete="off"
            noValidate
            className="flex flex-col space-y-3">
            {/* <Select
              isRequired
              isDisabled={isLoading || isSubmitting || loadingBtn}
              label="Masuk sebagai"
              placeholder="Pilih type account"
              size="lg"
              radius="sm"
              variant="faded"
              labelPlacement="outside"
              isInvalid={!!errors?.type ? true : false}
              errorMessage={errors?.type?.message && `${errors.type.message}`}
              {...register("type", {
                required: "Pilih type account",
              })}
              renderValue={(items: any) => {
                switch (items[0].key) {
                  case "NONASN":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UsersIcon className="size-6 mr-3 text-blue-500" />
                        <span className="font-bold">Personal - NON ASN</span>
                      </div>
                    );
                  case "PERSONAL":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UserCircleIcon className="size-6 mr-3 text-green-500" />
                        <span className="font-bold">Personal - PNS</span>
                      </div>
                    );
                  case "UMPEG":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UserGroupIcon className="size-6 mr-3 text-pink-500" />
                        <span className="font-bold">
                          Pengelola Kepegawaian (UMPEG)
                        </span>
                      </div>
                    );
                }
              }}>
              <SelectItem key="NONASN" textValue="NONASN">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UsersIcon className="size-6" />
                  <span className="font-bold">Personal - NON ASN</span>
                </div>
              </SelectItem>
              <SelectItem key="PERSONAL" textValue="PERSONAL">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UserCircleIcon className="size-6" />
                  <span className="font-bold">Personal - PNS</span>
                </div>
              </SelectItem>
              <SelectItem key="UMPEG" textValue="UMPEG">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UserGroupIcon className="size-6" />
                  <span className="font-bold">
                    Pengelola Kepegawaian (UMPEG)
                  </span>
                </div>
              </SelectItem>
            </Select> */}
            <Input
              isRequired
              isDisabled={isLoading || isSubmitting || loadingBtn}
              variant="faded"
              type="text"
              color={errors?.password ? "danger" : "default"}
              radius="sm"
              label="Username"
              labelPlacement="inside"
              placeholder="Enter your username"
              size="lg"
              isInvalid={errors?.username ? true : false}
              errorMessage={
                errors?.username?.message && `${errors.username.message}`
              }
              {...register("username", {
                required: "Username wajib diisi",
                minLength: {
                  value: 3,
                  message: "Masukan minimal 3 karakter",
                },
              })}
              startContent={
                <UserIcon className="size-5 text-default-400 pointer-events-none shrink-0 mr-2" />
              }
              className="transition-all duration-300"
              classNames={{
                label: "pb-1",
                inputWrapper:
                  "dark:bg-gradient-to-t dark:from-slate-900/80 dark:to-white/20",
              }}
            />
            <Input
              isRequired
              isDisabled={isLoading || isSubmitting || loadingBtn}
              label="Password"
              variant="faded"
              size="lg"
              color={errors?.password ? "danger" : "default"}
              isInvalid={errors?.password ? true : false}
              radius="sm"
              labelPlacement="inside"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password wajib diisi",
              })}
              errorMessage={
                errors?.password?.message && `${errors.password.message}`
              }
              startContent={
                <KeyIcon className="size-5 text-default-400 pointer-events-none shrink-0 mr-2" />
              }
              endContent={
                <Tooltip
                  content={
                    !isVisible ? "Lihat Password" : "Sembuyikan Password"
                  }>
                  <button
                    className="focus:outline-hidden"
                    type="button"
                    tabIndex={-1}
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility">
                    {!isVisible ? (
                      <EyeSlashIcon className="size-6 text-gray-400 dark:text-gray-200" />
                    ) : (
                      <EyeIcon className="size-6 text-gray-800 dark:text-gray-400" />
                    )}
                  </button>
                </Tooltip>
              }
              type={isVisible ? "text" : "password"}
              className="transition-all duration-300"
              classNames={{
                label: "pb-1",
                inputWrapper:
                  "dark:bg-gradient-to-t dark:from-slate-900/80 dark:to-white/20",
              }}
            />
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-60 mt-3 group"
              isDisabled={isLoading || isSubmitting || loadingBtn || !isValid}
              isLoading={isLoading || isSubmitting || loadingBtn}
              type="submit"
              fullWidth
              size="lg"
              color="primary"
              variant="shadow"
              endContent={
                isLoading || isSubmitting || loadingBtn ? (
                  ""
                ) : (
                  <ArrowRightCircleIcon className="group-hover:ml-7 transition-all duration-400" />
                )
              }
              spinner={
                <Spinner
                  color={resolvedTheme === "dark" ? "warning" : "default"}
                  variant="dots"
                  size="sm"
                />
              }
              radius="sm">
              {isLoading || isSubmitting || loadingBtn ? "" : "Masuk Sekarang"}
            </Button>
            <div className="flex justify-between items-center">
              {/* <HeroLink
                color="primary"
                onPress={() => {
                  destroy();
                  router.refresh();
                }}
                className="flex items-center gap-2 text-pink-500 hover:text-pink-600 cursor-pointer">
                <ChevronLeftIcon className="size-4" />
                Back
              </HeroLink> */}
              <Link
                color="primary"
                prefetch
                href="/login/lupa-password"
                className="text-indigo-700 hover:text-indigo-800 dark:text-blue-100 dark:hover:text-blue-100/80 hover:underline">
                Lupa atau ganti password ?
              </Link>
            </div>
            {/* <div className="flex items-center mb-6">
              <div className="grow border-t border-gray-100 dark:border-gray-400"></div>
              <span className="px-4 text-gray-100">
                <LockClosedIcon className="size-6 text-gray-100" />
              </span>
              <div className="grow border-t border-gray-100 dark:border-gray-400"></div>
            </div> */}
            {/* <Button
              onPress={() => {
                router.push("/login/perangkat");
              }}
              fullWidth
              size="lg"
              color="secondary"
              startContent={<DevicePhoneMobileIcon />}
              variant="solid">
              Registrasi Perangkat
            </Button> */}
          </form>
        </CardBody>
        <CardFooter>
          <span className="text-black/40 dark:text-white/40 text-sm text-ellipsis text-center">
            &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Balangan.
          </span>
        </CardFooter>
      </Card>
    </>
  );
}
