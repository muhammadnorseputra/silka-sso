"use client";

import type React from "react";
import {
  addToast,
  Alert,
  Button,
  Card,
  CardBody,
  Input,
  InputOtp,
  Spinner,
  Tooltip,
} from "@heroui/react";
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { doResetPassword } from "@/data/do-reset-password";
import { unauthorized, useRouter } from "next/navigation";
import { useState } from "react";

export default function Confirm({ access_token, decoded }: any) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm();

  function toggleVisibility() {
    return setIsVisible(!isVisible);
  }

  const onSubmit = async (FormFileds: any) => {
    const result = await doResetPassword(
      Object.assign(FormFileds, {
        access_token,
        type: decoded.type,
      })
    );

    if (result.responseCode === 401) {
      return unauthorized();
    }

    if (!result.status) {
      return addToast({
        title: "Galat",
        description: result.message,
        color: "danger",
        variant: "bordered",
      });
    }

    toast.success(result.message);
    router.replace("/");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {access_token && (
          <Alert
            icon={<InboxArrowDownIcon className="size-6 text-green-300" />}
            color="success"
            description="Kode OTP telah di-kirim, silahkan periksa email anda"
            title="Pemberitahuan"
            variant="faded"
          />
        )}
        <Card className="w-full mt-4 min-w-[450px]">
          <CardBody className="p-6">
            <Link
              href="/lupa-password"
              className="flex items-center text-blue-600 mb-6 gap-1 w-fit">
              <ChevronLeftIcon className="size-4" />
              Batal
            </Link>
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
              autoComplete="off"
              noValidate
              className="space-y-3 overflow-hidden">
              <Input
                isRequired
                size="lg"
                label="New Password"
                placeholder="Masukan password baru"
                isInvalid={!!errors?.new_password}
                errorMessage={
                  errors?.new_password && `${errors?.new_password?.message}`
                }
                color={errors?.new_password ? "danger" : "default"}
                {...register("new_password", {
                  required: "Please enter the new password",
                })}
                endContent={
                  <Tooltip
                    showArrow={true}
                    color="primary"
                    content={
                      !isVisible ? "Lihat Password" : "Sembuyikan Password"
                    }>
                    <Button
                      className="focus:outline-none"
                      tabIndex={-1}
                      size="sm"
                      radius="full"
                      onPress={toggleVisibility}
                      aria-label="toggle password visibility">
                      {!isVisible ? (
                        <EyeSlashIcon className="size-6 text-gray-400 dark:text-gray-200" />
                      ) : (
                        <EyeIcon className="size-6 text-gray-800 dark:text-gray-400" />
                      )}
                    </Button>
                  </Tooltip>
                }
                type={isVisible ? "text" : "password"}
              />
              <InputOtp
                isRequired
                length={6}
                variant="bordered"
                description="Silahkan masukan kode OTP yang telah dikirimkan ke email anda"
                {...register("otp", {
                  required: "Please enter the OTP",
                })}
              />
              <Button
                type="submit"
                color="primary"
                className="w-full h-12 text-base font-medium disabled:hover:opacity-10 disabled:opacity-10 disabled:cursor-not-allowed"
                isLoading={isLoading || isSubmitting}
                isDisabled={isLoading || isSubmitting || !isValid}
                spinner={
                  <Spinner color="default" variant="spinner" size="sm" />
                }>
                {isLoading || isSubmitting ? "" : "Submit"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
