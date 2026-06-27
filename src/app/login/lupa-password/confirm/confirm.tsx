"use client";

import {
  Alert,
  Button,
  Card,
  CardBody,
  Input,
  InputOtp,
  Spinner,
  Tooltip,
  Link,
} from "@heroui/react";
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { doResetPassword } from "@/data/do-reset-password";
import { unauthorized, useRouter } from "next/navigation";
import { useState } from "react";

export default function Confirm({ access_token, decoded }: any) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isLoading, isSubmitting },
  } = useForm();

  // Watch the first password field to compare it with the second
  // eslint-disable-next-line react-hooks/incompatible-library
  const new_password = watch("new_password");

  function toggleVisibility() {
    return setIsVisible(!isVisible);
  }

  function toggleVisibilityConfirmPassword() {
    return setIsVisibleConfirmPassword(!isVisibleConfirmPassword);
  }

  const onSubmit = async (FormFileds: any) => {
    const result = await doResetPassword(
      Object.assign(FormFileds, {
        access_token,
        type: decoded.type,
      }),
    );

    if (result.responseCode === 401) {
      return unauthorized();
    }

    if (!result.status) {
      return toast.error(result.message);
    }

    toast.success(result.message);
    router.replace("/");
  };
  return (
    <>
      {/* Gradient Background */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-0 left-0 md:w-125 md:h-125 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 md:w-125 md:h-125 bg-fuchsia-500/10 blur-3xl rounded-full" />
      </div> */}
      <Card
        fullWidth={true}
        shadow="none"
        radius="none"
        className="relative w-full max-w-xl min-h-screen px-2 sm:px-8 bg-transparent"
      >
        <CardBody className="inline-flex justify-center items-start">
          <Button
            onPress={() => router.back()}
            as={Link}
            variant="flat"
            color="danger"
            className="flex items-center text-red-600 dark:text-red-300 gap-1 mb-4 w-fit"
          >
            <ChevronLeftIcon className="size-4" />
            Batal
          </Button>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            autoComplete="off"
            noValidate
            className="inline-flex flex-col space-y-6 w-full bg-white dark:bg-linear-to-b dark:from-slate-900 dark:to-slate-700 p-6 rounded-2xl ring-4 ring-blue-100/60 dark:ring-slate-700"
          >
            <Input
              isRequired
              size="lg"
              radius="sm"
              label="New Password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              placeholder="Masukan password baru"
              description="Password must contain uppercase, lowercase, number, and special character"
              isInvalid={!!errors?.new_password}
              errorMessage={
                errors?.new_password && `${errors?.new_password?.message}`
              }
              color={errors?.new_password ? "danger" : "default"}
              {...register("new_password", {
                required: "Please enter the new password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
              endContent={
                <Tooltip
                  showArrow={true}
                  color="primary"
                  content={
                    !isVisible ? "Lihat Password" : "Sembuyikan Password"
                  }
                >
                  <Button
                    className="focus:outline-hidden"
                    tabIndex={-1}
                    size="sm"
                    radius="full"
                    onPress={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {!isVisible ? (
                      <EyeSlashIcon className="size-6 text-gray-400 dark:text-gray-200" />
                    ) : (
                      <EyeIcon className="size-6 text-gray-800 dark:text-gray-400" />
                    )}
                  </Button>
                </Tooltip>
              }
            />
            <Input
              isRequired
              size="lg"
              radius="sm"
              label="Retype Password"
              type={isVisibleConfirmPassword ? "text" : "password"}
              variant="bordered"
              placeholder="Masukan password yang sama"
              isInvalid={!!errors?.confirmPassword}
              errorMessage={
                errors?.confirmPassword && `${errors?.confirmPassword?.message}`
              }
              color={errors?.confirmPassword ? "danger" : "default"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === new_password || "Passwords do not match",
              })}
              endContent={
                <Tooltip
                  showArrow={true}
                  color="primary"
                  content={
                    !isVisibleConfirmPassword
                      ? "Lihat Password"
                      : "Sembuyikan Password"
                  }
                >
                  <Button
                    className="focus:outline-hidden"
                    tabIndex={-1}
                    size="sm"
                    radius="full"
                    onPress={toggleVisibilityConfirmPassword}
                    aria-label="toggle password visibility"
                  >
                    {!isVisibleConfirmPassword ? (
                      <EyeSlashIcon className="size-6 text-gray-400 dark:text-gray-200" />
                    ) : (
                      <EyeIcon className="size-6 text-gray-800 dark:text-gray-400" />
                    )}
                  </Button>
                </Tooltip>
              }
            />
            <div className="mb-2">
              {access_token && (
                <Alert
                  icon={
                    <InboxArrowDownIcon className="size-6 text-green-200" />
                  }
                  color="success"
                  description="Kode OTP telah di-kirim, silahkan periksa email anda"
                  title="Pemberitahuan"
                  variant="faded"
                />
              )}
            </div>
            <InputOtp
              classNames={{
                description: "text-gray-800",
              }}
              isRequired
              length={6}
              variant="bordered"
              size="lg"
              description="Silahkan masukan kode OTP yang telah dikirimkan ke email anda"
              {...register("otp", {
                required: "Please enter the OTP",
              })}
            />
            <Button
              type="submit"
              color="primary"
              className="w-full h-12 text-base font-medium disabled:hover:opacity-40 disabled:opacity-20 disabled:cursor-not-allowed"
              isLoading={isLoading || isSubmitting}
              isDisabled={isLoading || isSubmitting}
              spinner={<Spinner color="current" variant="spinner" size="sm" />}
            >
              {isLoading || isSubmitting ? "" : "Submit"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
