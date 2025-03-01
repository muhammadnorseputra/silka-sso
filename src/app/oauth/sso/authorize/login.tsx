"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Spinner,
  addToast,
} from "@heroui/react";
import Link from "next/link";
import {
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  KeyIcon,
  LockClosedIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { permanentRedirect } from "next/navigation";
import AuthVerify from "@/data/auth-actions";

export default function Login({ client, state, scope }: any) {
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
    setLoadingBtn(true);

    const result = await AuthVerify(
      Object.assign({}, FormFileds, {
        scope,
        client_id:
          client?.data.client_id ?? process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
        client_secret:
          client?.data.client_secret ?? process.env.NEXT_PUBLIC_SSO_SECRET_KEY,
      })
    );

    if (!result.response.status) {
      setLoadingBtn(false);
      addToast({
        title: "Galat",
        description: result?.response.message,
        color: "danger",
        variant: "bordered",
      });
    }

    // pesan success jik true dan redirect ke dashboard
    if (result.response.status) {
      addToast({
        title: "Success",
        description: result?.response.message,
        color: "success",
        variant: "bordered",
      });

      // setTimeout(() => {
      // toast.remove("AUTH_TOAST_ID");
      // setLoadingBtn(false); comment => agar selalu loading hingga halaman dialihkan
      permanentRedirect(
        `${result?.response.data.redirect_uri}?state=${state}&code=${result?.response.data.code}`
      );
      // }, 3000);
    }
  };

  return (
    <Card
      fullWidth={false}
      shadow="lg"
      radius="lg"
      className="px-4 mx-auto z-10 md:px-8 py-3 md:py-6 md:max-w-lg lg:max-w-md bg-white dark:bg-gradient-to-b dark:from-black dark:to-blue-950 backdrop-blur-xl">
      <CardHeader>
        <div className="flex flex-col">
          <h3 className="text-3xl fw-bold flex items-center justify-start gap-x-3">
            Single Sign-On <FingerPrintIcon className="size-12 text-gray-300" />
          </h3>
          <p className="font-bold">Sistem Informasi Layanan Kepegawaian</p>
          <p className="text-sm text-default-400 mt-4 dark:text-white/70">
            Silahkan masukan username dan password kepegawaian anda yang
            terdaftar pada portal SILka.
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={handleSubmit(isSubmit)}
          method="POST"
          autoComplete="off"
          noValidate
          className="flex flex-col gap-y-4">
          <Select
            isRequired
            isDisabled={isLoading || isSubmitting || loadingBtn}
            label="Login sebagai ?"
            placeholder="Pilih type account"
            size="lg"
            radius="sm"
            variant="underlined"
            labelPlacement="outside"
            isInvalid={!!errors?.type ? true : false}
            errorMessage={errors?.type?.message && `${errors.type.message}`}
            {...register("type", {
              required: "Pilih type account",
            })}>
            <SelectItem key="PERSONAL" textValue="PERSONAL">
              <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                <UserCircleIcon className="size-6" />
                <span className="font-bold">Personal - PNS</span>
              </div>
            </SelectItem>
            <SelectItem key="UMPEG" textValue="UMPEG">
              <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                <UserGroupIcon className="size-6" />
                <span className="font-bold">Pengelola Kepegawaian (UMPEG)</span>
              </div>
            </SelectItem>
          </Select>
          <Input
            isRequired
            isDisabled={isLoading || isSubmitting || loadingBtn}
            variant="underlined"
            type="text"
            radius="sm"
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
              <UserIcon className="size-5 text-default-400 pointer-events-none flex-shrink-0 mr-2" />
            }
          />
          <Input
            isRequired
            isDisabled={isLoading || isSubmitting || loadingBtn}
            label="Password"
            variant="underlined"
            size="lg"
            // color={errors?.password ? "danger" : "default"}
            isInvalid={errors?.password ? true : false}
            radius="sm"
            labelPlacement="outside"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password wajib diisi",
            })}
            errorMessage={
              errors?.password?.message && `${errors.password.message}`
            }
            startContent={
              <KeyIcon className="size-5 text-default-400 pointer-events-none flex-shrink-0 mr-2" />
            }
            endContent={
              <Tooltip
                content={!isVisible ? "Lihat Password" : "Sembuyikan Password"}>
                <button
                  className="focus:outline-none"
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
            isDisabled={isLoading || isSubmitting || loadingBtn || !isValid}
            isLoading={isLoading || isSubmitting || loadingBtn}
            type="submit"
            fullWidth
            color="primary"
            size="lg"
            variant="solid"
            spinner={<Spinner color="default" variant="spinner" size="sm" />}
            radius="sm"
            className="mt-3">
            {isLoading || isSubmitting || loadingBtn ? "" : "Login Sekarang"}
          </Button>

          <Link
            color="primary"
            prefetch={false}
            href="/lupa-password"
            className="text-blue-500 hover:text-blue-800">
            Lupa atau Ganti Password ?
          </Link>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-gray-500">
              <LockClosedIcon className="size-6 text-gray-300" />
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
        </form>
      </CardBody>
      <CardFooter className="flex flex-col md:flex-row items-center md:items-end justify-between dark:bg-transparent">
        <span className="text-gray-400 dark:text-gray-600 text-sm text-ellipsis text-center">
          &copy; Dikembangakan oleh Bidang Pengadaan, Pemberhetian dan Informasi
          Kepegawaian (PPIK) <br /> BKPSDM Kab. Balangan Tahun 2025.
        </span>
      </CardFooter>
    </Card>
  );
}
