"use client";

// Organized imports
import { useEffect, useState } from "react";
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
  CircularProgress,
  cn,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

// Icons
import {
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

// Persisted cooldown keys so the timer survives a page refresh
const COOLDOWN_STORAGE_KEY = "sso-login-cooldown-end";
const COOLDOWN_TOTAL_STORAGE_KEY = "sso-login-cooldown-total";

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
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [cooldownTotalSeconds, setCooldownTotalSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Restore an active cooldown from localStorage so it survives a refresh
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const storedEnd = Number(
      window.localStorage.getItem(COOLDOWN_STORAGE_KEY) ?? 0,
    );
    const storedTotal = Number(
      window.localStorage.getItem(COOLDOWN_TOTAL_STORAGE_KEY) ?? 0,
    );

    if (storedEnd > Date.now()) {
      const remaining = Math.ceil((storedEnd - Date.now()) / 1000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCooldownSeconds(remaining);
      setCooldownTotalSeconds(
        storedTotal >= remaining ? storedTotal : remaining,
      );
    } else if (storedEnd > 0) {
      // Cooldown already finished — clean up stale entries
      window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      window.localStorage.removeItem(COOLDOWN_TOTAL_STORAGE_KEY);
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      // Clear persisted cooldown once the timer fully finishes
      if (typeof window !== "undefined") {
        const storedEnd = Number(
          window.localStorage.getItem(COOLDOWN_STORAGE_KEY) ?? 0,
        );
        if (storedEnd > 0 && storedEnd <= Date.now()) {
          window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
          window.localStorage.removeItem(COOLDOWN_TOTAL_STORAGE_KEY);
        }
      }
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownSeconds]);

  const handleLogin = async (formData: FormData) => {
    try {
      clearErrors();
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
        redirect_uri: redirectUri,
      };

      const result = await AuthVerify(payload);
      const apiResponse = result?.response?.response ?? result?.response ?? result;
      const loginStatus = apiResponse?.status ?? false;
      const loginMessage = apiResponse?.message ?? "Terjadi kesalahan saat verifikasi";
      const retrySeconds = Number(apiResponse?.timer ?? 0);

      if (!loginStatus) {
        setError("username", {
          type: "manual",
        });
        setError("password", {
          type: "manual",
        });

        if (retrySeconds > 0) {
          setCooldownSeconds(retrySeconds);
          setCooldownTotalSeconds(retrySeconds);
          // eslint-disable-next-line react-hooks/purity
          const cooldownEnd = Date.now() + retrySeconds * 1000;
          window.localStorage.setItem(
            COOLDOWN_STORAGE_KEY,
            String(cooldownEnd),
          );
          window.localStorage.setItem(
            COOLDOWN_TOTAL_STORAGE_KEY,
            String(retrySeconds),
          );
        }

        toast.error(loginMessage, { id: "auth-verify" });
        return;
      }

      toast.success(loginMessage || "Login berhasil", { id: "auth-verify" });

      // Login success — cooldown no longer applies
      window.localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      window.localStorage.removeItem(COOLDOWN_TOTAL_STORAGE_KEY);

      // Redirect to the izin-access page if consent is required
      if(apiResponse?.data?.is_consent)
        {
        permanentRedirect(
          `/oauth/sso/izin-access`,
        );
      }

      // Redirect to the client application with the authorization code if consent is not required
      if ((result?.response?.data?.code || apiResponse?.data?.code) && apiResponse?.data?.is_consent === false) {
        permanentRedirect(
          `${redirectUri}?state=${state}&code=${result?.response?.data?.code ?? apiResponse?.data?.code}`,
        );
      }
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message || "Terjadi kesalahan saat verifikasi"
          : "Terjadi kesalahan saat verifikasi";
      setError("username", { type: "manual" });
      setError("password", { type: "manual" });
      toast.error(fallbackMessage, { id: "auth-verify" });
    } finally {
      setLoadingBtn(false);
    }
  };

  const isDisabled = isSubmitting || loadingBtn || cooldownSeconds > 0;
  const submitButtonLabel = cooldownSeconds > 0
    ? `Tunggu ${cooldownSeconds}s`
    : "Masuk Sekarang";

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
              isSubmitting && "blur-2xl",
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
              {cooldownSeconds > 0 && (
                <div className="flex items-center gap-4 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3.5 dark:border-amber-700/40 dark:bg-amber-900/20">
                  <CircularProgress
                    aria-label="Waktu tunggu percobaan login"
                    size="lg"
                    color="warning"
                    value={cooldownSeconds}
                    maxValue={cooldownTotalSeconds || cooldownSeconds}
                    showValueLabel
                    valueLabel={
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
                          {cooldownSeconds}
                        </span>
                      </div>
                    }
                    classNames={{
                      svg: "size-16 shrink-0",
                      track: "stroke-amber-200 dark:stroke-amber-800/60",
                      indicator: "stroke-amber-500 dark:stroke-amber-400",
                    }}
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                      Terlalu banyak percobaan gagal
                    </p>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Silakan coba lagi dalam{" "}
                      <b className="tabular-nums text-amber-900 dark:text-amber-100">
                        {cooldownSeconds}
                      </b>{" "}
                      detik.
                    </p>
                  </div>
                </div>
              )}

              <Input
                autoFocus
                isRequired
                isDisabled={isDisabled}
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
                isLoading={isSubmitting || loadingBtn}
                type="submit"
                fullWidth
                size="lg"
                color="primary"
                variant="solid"
                endContent={
                  isDisabled || cooldownSeconds > 0 ? (
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
                {cooldownSeconds > 0 ? `Tunggu ${cooldownSeconds}s` : isDisabled ? "" : submitButtonLabel}
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
