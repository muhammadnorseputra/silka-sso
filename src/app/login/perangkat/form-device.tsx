"use client";

import RegisterDevicesId from "@/data/register-devices-id";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { Button, Card, CardBody, Input, Snippet, Spinner } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Activity } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { getCookie, hasCookie, setCookie } from "cookies-next/client";

export default function FormDevice({ device }: any) {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm();

  const [token, setToken] = React.useState("");

  const router = useRouter();
  const stateDevice = uuidv4();
  const stateFromCookie = getCookie("device_id_state");

  React.useLayoutEffect(() => {
    if (!hasCookie("device_id_state")) {
      setCookie("device_id_state", stateDevice, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }
  });

  console.log("device_info :", device);

  const onSubmit = async (FormFileds: any) => {
    // kirim data ke be
    const FromData = {
      state: stateFromCookie,
      ...FormFileds,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await toast.promise(RegisterDevicesId(FromData), {
        loading: "Sedang memproses...",
        success: (result) => {
          if (result.message.user_id) {
            setError("user_id", {
              type: "manual",
              message: result.message.user_id || "Gagal mendapatkan user_id",
            });
          }

          if (result.message.user_label) {
            setError("user_label", {
              type: "manual",
              message:
                result.message.user_label || "Gagal mendapatkan user_label",
            });
          }

          if (result.message.state) {
            throw new Error(result.message.state);
          }

          if (!result.status) {
            throw new Error(result.message);
          }

          if (result.device_id) {
            setToken(result.device_id);
          }
          router.push("/login");
          return result.message;
        },
        error: (err) => err.message || "Terjadi kesalahan pada server",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* Gradient Background */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-full sm:min-w-125">
          <Card className="rounded-3xl border border-white dark:border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-6 md:p-8">
            <CardBody>
              <Link
                href="/login"
                className="flex items-center text-blue-600 dark:text-blue-300 mb-6 gap-1 w-fit hover:underline">
                <ChevronLeftIcon className="size-4" />
                Back to Login
              </Link>
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                autoComplete="off"
                noValidate
                className="space-y-6">
                <Activity
                  mode={device?.device_id || token ? "visible" : "hidden"}>
                  <Input
                    isDisabled
                    fullWidth
                    isReadOnly
                    defaultValue={device?.device_id || token}
                    label="DEVICE ID"
                    type="text"
                    variant="underlined"
                  />
                </Activity>
                <Activity
                  mode={!device?.device_id && !token ? "visible" : "hidden"}>
                  <Input
                    isDisabled
                    fullWidth
                    isReadOnly
                    defaultValue={"Belum Terdaftar"}
                    label="DEVICE ID"
                    type="text"
                    variant="underlined"
                  />
                </Activity>
                <Input
                  fullWidth
                  defaultValue={device.user_id}
                  label="NIP"
                  placeholder="Masukan NIP disini ..."
                  type="number"
                  maxLength={18}
                  minLength={8}
                  size="lg"
                  variant="faded"
                  isInvalid={!!errors?.user_id}
                  errorMessage={errors?.user_id && `${errors?.user_id.message}`}
                  color={errors?.user_id ? "danger" : "default"}
                  {...register("user_id", {
                    required: "NIP wajib diisi",
                    minLength: {
                      value: 8,
                      message: "NIP minimal 8 karakter",
                    },
                    maxLength: {
                      value: 18,
                      message: "NIP maksimal 18 karakter",
                    },
                  })}
                />
                <Input
                  fullWidth
                  defaultValue={device.user_label}
                  label="Label Perangkat - Nama Pengguna"
                  placeholder="Masukan Label disini ..."
                  description="Silahkan buat label perangkat. Contoh: Laptop Kantor - Fitriani"
                  type="text"
                  size="lg"
                  variant="faded"
                  isInvalid={!!errors?.user_label}
                  errorMessage={
                    errors?.user_label && `${errors?.user_label.message}`
                  }
                  color={errors?.user_label ? "danger" : "default"}
                  {...register("user_label", {
                    required: "Label wajib diisi",
                    pattern: {
                      value: /^[a-zA-Z0-9\s\-]+$/,
                      message:
                        "Label hanya boleh mengandung huruf, angka, spasi dan -",
                    },
                  })}
                />
                <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.ip}
                  label="IP"
                  type="text"
                  variant="underlined"
                />
                <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.browser}
                  label="BROWSER"
                  type="text"
                  variant="underlined"
                />
                <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.os}
                  label="OS (SISTEM OPERASI)"
                  type="text"
                  variant="underlined"
                />
                {/* <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.device}
                  label="DEVICE"
                  type="text"
                  variant="underlined"
                />
                <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.model}
                  label="MODEL"
                  type="text"
                  variant="underlined"
                />
                <Input
                  isDisabled
                  fullWidth
                  isReadOnly
                  defaultValue={device.vendor}
                  label="VENDOR"
                  type="text"
                  variant="underlined"
                /> */}
                <Button
                  isDisabled={isLoading || isSubmitting}
                  className="disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-600"
                  isLoading={isLoading || isSubmitting}
                  type="submit"
                  fullWidth
                  size="lg"
                  color="primary"
                  variant="solid"
                  spinner={<Spinner color="default" variant="dots" size="sm" />}
                  radius="sm">
                  {isLoading || isSubmitting ? "" : "Simpan"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
