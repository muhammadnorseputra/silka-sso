"use client";

// Organized imports
import { useState } from "react";
import { permanentRedirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useReCaptcha } from "next-recaptcha-v3";

// UI Components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Tooltip,
  Spinner,
  Divider,
  cn,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

// Icons
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

// Custom Components
import ChipComponent from "@/components/chip";

// Data Services
import AuthVerify from "@/data/auth-actions";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";

// Interfaces
interface LoginProps {
  client: any;
  state?: string;
  scope?: string;
  redirectUri?: string;
  typeAccount: string;
}

interface FormData {
  username: string;
  password: string;
}

// Reusable Components
const Logo = () => (
  <div className="w-25 h-25 rounded-full  relative">
    <Image
      width={35}
      height={35}
      src={"/logo.png"}
      alt="Logo Balangan"
      className="absolute left-6 top-5 w-auto h-auto"
    />
  </div>
);

const Title = () => (
  <h3 className="relative text-3xl font-display font-bold flex items-center justify-center gap-x-3 mt-4">
    Single Sign-On
  </h3>
);

export default function Login({
  client,
  state = uuidv4(),
  scope,
  redirectUri = `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}/${process.env.NEXT_PUBLIC_PORTAL_SSO_CALLBACK as string}`,
  typeAccount,
}: LoginProps) {
  const { executeRecaptcha } = useReCaptcha();
  const [isVisible, setIsVisible] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (formData: FormData) => {
    try {
      setLoadingBtn(true);

      // Generate ReCaptcha token
      const token = await executeRecaptcha("form_submit");

      const payload = {
        token,
        ...formData,
        scope,
        client_id: client?.data.client_id,
        client_secret: client?.data.client_secret,
        state,
      };

      const result = await toast.promise(
        AuthVerify(payload),
        {
          loading: "Memverifikasi akun...",
          success: (result) => {
            if (!result.response.status) {
              setError("username", { type: "manual" });
              setError("password", { type: "manual" });
              throw new Error(result.response.message);
            }
            return result.response.message;
          },
          error: (err) => err.message || "Terjadi kesalahan saat verifikasi",
        },
        { id: "auth-verify" },
      );

      if (result?.response.status) {
        permanentRedirect(
          `${redirectUri}?state=${state}&code=${result?.response.data.code}`,
        );
      }
    } finally {
      setLoadingBtn(false);
    }
  };

  const isDisabled = isSubmitting || loadingBtn;

  return (
    <>
      <Card
        fullWidth={true}
        shadow="none"
        radius="none"
        className="relative w-full max-w-xl px-2 sm:px-8 sm:pt-2 bg-transparent"
      >
        <CardHeader className="flex flex-col">
          <div
            className={cn("rounded-full bg-transparent",
              isDisabled && "blur-2xl",
            )}
          >
            <Logo />
          </div>
          <ChipComponent name={typeAccount} />
          <Title />
          <p className="font-display font-semibold text-center tracking-wide">
            Sistem Informasi Layanan Kepegawaian
          </p>
        </CardHeader>

        <CardBody>
          <MagicCard mode="gradient" gradientColor="" gradientFrom="oklch(85.5% 0.138 181.071)" gradientTo="oklch(70.4% 0.14 182.503)" className="relative overflow-hidden rounded-2xl bg-white dark:bg-linear-to-b dark:from-slate-800 dark:to-black p-8">
            <form
              onSubmit={handleSubmit(handleLogin)}
              method="POST"
              autoComplete="off"
              noValidate
              className=" flex flex-col space-y-6"
            >
              <Input
                autoFocus
                isRequired
                isDisabled={isSubmitting || loadingBtn}
                variant="underlined"
                type="text"
                color={errors?.username ? "danger" : "default"}
                radius="sm"
                label="Username"
                labelPlacement="outside"
                placeholder="Masukan username anda"
                size="lg"
                isInvalid={!!errors?.username}
                errorMessage={errors?.username?.message}
                {...register("username", {
                  required: "Username wajib diisi",
                  minLength: {
                    value: 3,
                    message: "Masukan minimal 3 karakter",
                  },
                })}
                startContent={
                  <UserIcon
                    className={cn(
                      `size-5 text-default-300 dark:text-slate-400 mr-2`,
                      errors?.username && "text-red-500 dark:text-red-500",
                    )}
                  />
                }
                endContent={
                  errors?.username && (
                    <ExclamationCircleIcon className="text-red-500 size-6 pointer-events-none shrink-0" />
                  )
                }
                className="group"
                classNames={{
                  errorMessage: "-ml-1 tracking-wide",
                  input:
                    "placeholder:text-gray-300 dark:placeholder:text-slate-400 disabled:cursor-not-allowed",
                  inputWrapper: "bg-transparent",
                }}
              />
              <Input
                isRequired
                isDisabled={isDisabled}
                label="Password"
                variant="underlined"
                size="lg"
                color={errors?.password ? "danger" : "default"}
                isInvalid={!!errors?.password}
                radius="sm"
                labelPlacement="outside"
                placeholder="Masukan password anda"
                {...register("password", {
                  required: "Password wajib diisi",
                })}
                errorMessage={errors?.password?.message}
                startContent={
                  <KeyIcon
                    className={cn(
                      `size-5 text-default-300 dark:text-slate-400 mr-2`,
                      errors?.password && "text-red-500 dark:text-red-500",
                    )}
                  />
                }
                endContent={
                  <>
                    {errors?.password && (
                      <ExclamationCircleIcon className="text-red-500 size-6 pointer-events-none shrink-0 mr-2" />
                    )}
                    <Tooltip
                      content={
                        !isVisible ? "Lihat Password" : "Sembuyikan Password"
                      }
                    >
                      <button
                        className="focus:outline-hidden cursor-pointer"
                        type="button"
                        tabIndex={-1}
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                      >
                        {!isVisible ? (
                          <EyeSlashIcon className="size-6 text-gray-400 dark:text-gray-200" />
                        ) : (
                          <EyeIcon className="size-6 text-gray-800 dark:text-gray-400" />
                        )}
                      </button>
                    </Tooltip>
                  </>
                }
                type={isVisible ? "text" : "password"}
                classNames={{
                  errorMessage: "-ml-1 tracking-wide",
                  input:
                    "placeholder:text-gray-300 dark:placeholder:text-slate-400 disabled:cursor-not-allowed",
                  inputWrapper: "bg-transparent",
                }}
                className="group"
              />
              <Button
                className="disabled:cursor-not-allowed disabled:opacity-30 group"
                isDisabled={isDisabled}
                isLoading={isDisabled}
                type="submit"
                fullWidth
                size="lg"
                color="primary"
                variant="solid"
                endContent={
                  isDisabled ? (
                    ""
                  ) : (
                    <ArrowRightIcon className="group-hover:ml-7 transition-all duration-400 size-6" />
                  )
                }
                spinner={
                  <Spinner color="current" variant="spinner" size="sm" />
                }
                radius="sm"
              >
                {isDisabled ? "" : "Masuk Sekarang"}
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
                <div className="inline-flex justify-start items-center space-x-1">
                  <span>Lupa Password?</span>
                  <Link
                    color="primary"
                    prefetch
                    href="/login/lupa-password"
                    className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-100/80"
                  >
                    Reset di sini
                  </Link>
                </div>
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
          </MagicCard>
        </CardBody>
        <CardFooter>
          <span className="text-black/40 dark:text-white/30 text-sm text-center w-full">
            2024 &copy; Dikembangakan oleh Bidang PPIK - BKPSDM Balangan.
          </span>
        </CardFooter>
      </Card>
    </>
  );
}
