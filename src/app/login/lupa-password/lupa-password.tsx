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

      <Card
        fullWidth={true}
        shadow="none"
        radius="none"
        className="relative w-full max-w-xl px-2 sm:px-8 pt-8 bg-transparent"
      >
        <CardBody className="inline-flex justify-center items-start">
          <Button
            onPress={() => router.back()}
            as={Link}
            variant="flat"
            color="danger"
            className="flex items-center text-red-600 dark:text-red-100 mb-6 gap-1 w-fit"
          >
            <ChevronLeftIcon className="size-4" />
            Back to Login
          </Button>

          <h1 className="text-xl md:text-2xl font-extrabold mb-6 text-gray-800 dark:text-white">
            Lupa atau{" "}
            <span className="relative">
              Ganti Password ?
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,10 100,5"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            autoComplete="off"
            noValidate
            className="inline-flex flex-col space-y-6 w-full bg-white dark:bg-linear-to-b dark:from-slate-900 dark:to-slate-700 p-6 rounded-2xl ring-4 ring-blue-100/60 dark:ring-slate-700"
          >
            <div>
              <Alert
                hideIconWrapper
                color="warning"
                description="Silahkan isi email anda yang terdaftar pada portal SILKa untuk
                mendapatkan Kode OTP dan melakukan reset password."
                variant="faded"
              />
            </div>
            <Input
              className="group"
              classNames={{
                errorMessage: "-ml-1 tracking-wide",
                input:
                  "placeholder:text-gray-300 dark:placeholder:text-slate-400",
                inputWrapper: "bg-transparent",
                description: "-ml-1 pt-2",
              }}
              isRequired
              radius="sm"
              label="Email"
              labelPlacement="outside"
              id="email"
              size="lg"
              variant="underlined"
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
                <EnvelopeIcon className="transition-all size-5 text-default-300 dark:text-slate-400 group-hover:text-default-600 group-focus:text-default-600 group-focus-within:text-default-600 group-focus-visible:text-default-600 mr-2" />
              }
            />

            <Button
              isLoading={isLoading || isSubmitting}
              type="submit"
              color="primary"
              variant="shadow"
              className="w-full h-12 text-base font-medium disabled:hover:opacity-40 disabled:opacity-40 disabled:cursor-not-allowed"
              isDisabled={isLoading || isSubmitting || !isValid}
              spinner={<Spinner color="default" variant="spinner" size="sm" />}
            >
              {isLoading || isSubmitting ? "" : "Kirim"}
            </Button>
          </form>
        </CardBody>
      </Card>
  );
}
