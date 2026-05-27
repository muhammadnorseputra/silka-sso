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
} from "@heroui/react";
import Link from "next/link";
// import { Link as HeroLink } from "@heroui/react";
import {
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

export default function Login({
  client,
  state = uuidv4(),
  scope,
  redirectUri = `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}/${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK as string}`,
  typeAccount,
}: any) {
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
          client?.data.client_id ?? "d0929547-5810-4d60-a653-2d39927a1755",
        client_secret:
          client?.data.client_secret ??
          "IU67[Y$.7F?NR(2%tllq]crmDdepYS]3a+a_]v]F88uP&!Y5`gpc#s47Z*Df'/w",
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
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 md:w-125 md:h-125 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 md:w-125 md:h-125 bg-fuchsia-500/10 blur-3xl rounded-full" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <h3 className="text-3xl fw-bold flex items-center justify-center gap-x-3">
          Single Sign-On{" "}
          <FingerPrintIcon className="size-12 text-gray-800 dark:text-white" />
        </h3>
        <p className="font-bold">Sistem Informasi Layanan Kepegawaian</p>
      </div>
      <Card
        fullWidth={false}
        shadow="sm"
        radius="lg"
        className="relative w-full max-w-lg rounded-3xl border border-white dark:border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-2 sm:p-6 md:p-8">
        <CardHeader className="flex flex-col">
          <div className="flex items-center justify-center w-full">
            <Alert
              color="primary"
              description="Silahkan gunakan akun anda untuk mengakses berbagai
            layanan kepegawaian."
              endContent={<ChipComponent name={typeAccount} />}
              variant="faded"
            />
          </div>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(isSubmit)}
            method="POST"
            autoComplete="off"
            noValidate
            className="flex flex-col gap-y-4">
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
              variant="bordered"
              type="text"
              radius="lg"
              label="Username"
              labelPlacement="outside"
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
            />
            <Input
              isRequired
              isDisabled={isLoading || isSubmitting || loadingBtn}
              label="Password"
              variant="bordered"
              size="lg"
              // color={errors?.password ? "danger" : "default"}
              isInvalid={errors?.password ? true : false}
              radius="lg"
              labelPlacement="outside"
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
            />
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-60"
              isDisabled={isLoading || isSubmitting || loadingBtn || !isValid}
              isLoading={isLoading || isSubmitting || loadingBtn}
              type="submit"
              fullWidth
              size="lg"
              color="primary"
              variant="shadow"
              spinner={<Spinner color="default" variant="dots" size="sm" />}
              radius="sm">
              {isLoading || isSubmitting || loadingBtn ? "" : "Login Sekarang"}
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
                className="text-blue-500 hover:text-blue-600 hover:underline">
                Lupa atau ganti password ?
              </Link>
            </div>
            <div className="flex items-center my-6">
              <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-gray-500">
                <LockClosedIcon className="size-6 text-gray-300" />
              </span>
              <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <Button
              onPress={() => {
                router.push("/login/perangkat");
              }}
              fullWidth
              size="lg"
              color="secondary"
              startContent={<DevicePhoneMobileIcon />}
              variant="bordered">
              Registrasi Perangkat
            </Button>
          </form>
        </CardBody>
      </Card>
      <span className="text-gray-400 dark:text-white text-sm text-ellipsis text-center">
        &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Kab. Balangan.
      </span>
    </>
  );
}
