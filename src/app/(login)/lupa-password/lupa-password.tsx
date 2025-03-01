"use client";

import type React from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { cekMailOTP } from "@/data/otp-reset-password";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm();

  const onSubmit = async (FormFileds: any) => {
    const result = await cekMailOTP(FormFileds);
    if (!result.status) {
      return setError("email", {
        type: "manual",
        message: result.message,
      });
    }
    toast.success(result.message);
    router.push("/lupa-password/confirm?state=" + result.state);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardBody className="p-6">
            <Link
              href="/"
              className="flex items-center text-blue-600 mb-6 gap-1 w-fit">
              <ChevronLeftIcon className="size-4" />
              Back to Login
            </Link>

            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Lupa password anda ?
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Silahkan isi email anda yang terdaftar pada portal SILKa untuk
              mendapatkan Kode OTP dan melakukan reset password.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
              autoComplete="off"
              noValidate
              className="space-y-6">
              <Select
                isRequired
                isInvalid={!!errors?.type}
                errorMessage={errors?.type && `${errors?.type?.message}`}
                color={errors?.type ? "danger" : "default"}
                label="Jenis Akun"
                {...register("type", {
                  required: "Pilih type account",
                })}
                placeholder="Pilih jenis akun">
                <SelectItem key="PERSONAL">PERSONAL - PNS</SelectItem>
                <SelectItem key="UMPEG">
                  PENGELOLA KEPEGAWAIAN (UMPEG)
                </SelectItem>
              </Select>
              <div className="space-y-2">
                <Input
                  isRequired
                  label="Email"
                  labelPlacement="inside"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  description="Kode OTP akan dikirimkan ke email anda."
                  isInvalid={!!errors?.email}
                  errorMessage={errors?.email && `${errors?.email.message}`}
                  color={errors?.email ? "danger" : "default"}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                  variant="flat"
                />
              </div>

              <Button
                isLoading={isLoading || isSubmitting}
                type="submit"
                color="primary"
                className="w-full h-12 text-base font-medium disabled:hover:opacity-10 disabled:opacity-10 disabled:cursor-not-allowed"
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
