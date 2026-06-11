"use client";

import { Button, Input, Card, CardBody, Spinner, Alert } from "@heroui/react";
import { ChevronLeftIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "@heroui/link";
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
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await toast.promise(cekMailOTP(FormFileds), {
        loading: "Mengirim permintaan...",
        success: (result) => {
          if (!result.status) {
            return setError("email", {
              type: "manual",
              message: result.message,
            });
          }

          router.push("/login/lupa-password/confirm?state=" + result.state);
          return result.message;
        },
        error: (err) => err.message || "Terjadi kesalahan",
      });
    } catch (error) {
      setError("email", {
        type: "manual",
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    }
  };
  return (
    <>
      {/* Gradient Background */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-0 left-0 md:w-125 md:h-125 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 md:w-125 md:h-125 bg-fuchsia-500/10 blur-3xl rounded-full" />
      </div> */}
      <Card className="w-full max-w-xl border-x rounded-none min-h-screen border-white/20 dark:border-white/10 bg-white/10 dark:bg-pink-200/10 backdrop-blur-sm shadow-sm p-2 sm:p-6 md:px-18 md:pt-2 md:pb-0 ring-1 ring-white/60 dark:ring-white/10">
        <CardBody className="inline-flex justify-center items-start">
          <Button
            onPress={() => router.back()}
            as={Link}
            variant="flat"
            color="danger"
            className="flex items-center text-red-600 dark:text-red-300 mb-6 gap-1 w-fit">
            <ChevronLeftIcon className="size-4" />
            Back to Login
          </Button>

          <h1 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-800 dark:text-white">
            Lupa atau Ganti Password ?
          </h1>
          <div>
            <Alert
              hideIconWrapper
              color="warning"
              description="Silahkan isi email anda yang terdaftar pada portal SILKa untuk
                mendapatkan Kode OTP dan melakukan reset password."
              variant="faded"
              className="mb-6"
            />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            autoComplete="off"
            noValidate
            className="space-y-6 w-full">
            <Input
              className="text-gray-800 dark:text-white"
              isRequired
              label="Email"
              labelPlacement="inside"
              id="email"
              size="lg"
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
              startContent={
                <EnvelopeIcon className="size-5 text-default-400 pointer-events-none shrink-0 mr-2" />
              }
            />

            <Button
              isLoading={isLoading || isSubmitting}
              type="submit"
              color="primary"
              variant="shadow"
              className="w-full h-12 text-base font-medium disabled:hover:opacity-40 disabled:opacity-40 disabled:cursor-not-allowed"
              isDisabled={isLoading || isSubmitting || !isValid}
              spinner={<Spinner color="default" variant="dots" size="sm" />}>
              {isLoading || isSubmitting ? "" : "Kirim"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
