"use client";

import type React from "react";
import { Button, Input, Card, CardBody, Spinner } from "@heroui/react";
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
    router.push("/login/lupa-password/confirm?state=" + result.state);
  };
  return (
    <>
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-fuchsia-500/10 blur-3xl rounded-full" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full">
          <Card className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
            <CardBody className="p-6">
              <Link
                href="/login"
                className="flex items-center text-blue-600 mb-6 gap-1 w-fit hover:underline">
                <ChevronLeftIcon className="size-4" />
                Back to Login
              </Link>

              <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Lupa atau Ganti Password ?
              </h1>

              <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm dark:text-amber-200 mb-6">
                Silahkan isi email anda yang terdaftar pada portal SILKa untuk
                mendapatkan Kode OTP dan melakukan reset password.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                autoComplete="off"
                noValidate
                className="space-y-6">
                <Input
                  isRequired
                  label="Email"
                  labelPlacement="inside"
                  id="email"
                  variant="faded"
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
                />

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
    </>
  );
}
