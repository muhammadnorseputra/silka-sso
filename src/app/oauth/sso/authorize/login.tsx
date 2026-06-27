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

// Interfaces
interface LoginProps {
  client: any;
  state?: string;
  scope: string;
  redirectUri?: string;
  typeAccount: string;
}

interface FormData {
  username: string;
  password: string;
}

// Reusable Components
const Logo = () => (
  <div className="p-3 border border-white/60 rounded-full bg-transparent">
    <div className="w-20 h-20 border border-white/80 rounded-full bg-white dark:bg-slate-900 backdrop-blur-lg shadow-xl shadow-white relative">
      <Image
        width={32}
        height={32}
        src={"/logo.png"}
        alt="Logo Balangan"
        className="absolute left-6 top-5 w-auto h-auto"
      />
    </div>
  </div>
);

const Title = () => (
  <h3 className="relative text-3xl font-display font-bold flex items-center justify-center gap-x-3 mt-4">
    Single Sign-On{" "}
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
      />
    </svg>
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
        className="relative w-full max-w-xl px-2 sm:px-8 sm:pt-8 bg-transparent"
      >
        <CardHeader className="flex flex-col">
          <div
            className={cn(
              "p-3 border border-white/40 rounded-full bg-transparent",
              isDisabled && "blur-2xl",
            )}
          >
            <Logo />
          </div>
          <Divider
            orientation="vertical"
            className="h-6 mx-auto bg-white/40 dark:bg-white/20"
          />
          <ChipComponent name={typeAccount} />
          <Title />
          <p className="font-display font-semibold text-center tracking-wide">
            Sistem Informasi Layanan Kepegawaian
          </p>
        </CardHeader>

        <CardBody>
          <form
            onSubmit={handleSubmit(handleLogin)}
            method="POST"
            autoComplete="off"
            noValidate
            className="relative ring-2 ring-blue-50  overflow-hidden rounded-2xl flex flex-col space-y-6 bg-white dark:bg-linear-to-b dark:from-slate-800 dark:to-black p-8"
          >
            {/* <Select
              isRequired
              isDisabled={isLoading || isSubmitting || loadingBtn}
              label="Masuk sebagai"
              placeholder="Pilih type account"
              size="lg"
              radius="sm"
              variant="faded"
              labelPlacement="outside"
              isInvalid={!!errors?.type ? true : false}
              errorMessage={errors?.type?.message && `${errors.type.message}`}
              {...register("type", {
                required: "Pilih type account",
              })}
              renderValue={(items: any) => {
                switch (items[0].key) {
                  case "NONASN":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UsersIcon className="size-6 mr-3 text-blue-500" />
                        <span className="font-bold">Personal - NON ASN</span>
                      </div>
                    );
                  case "PERSONAL":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UserCircleIcon className="size-6 mr-3 text-green-500" />
                        <span className="font-bold">Personal - PNS</span>
                      </div>
                    );
                  case "UMPEG":
                    return (
                      <div className="flex flex-row items-center justify-start">
                        <UserGroupIcon className="size-6 mr-3 text-pink-500" />
                        <span className="font-bold">
                          Pengelola Kepegawaian (UMPEG)
                        </span>
                      </div>
                    );
                }
              }}>
              <SelectItem key="NONASN" textValue="NONASN">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UsersIcon className="size-6" />
                  <span className="font-bold">Personal - NON ASN</span>
                </div>
              </SelectItem>
              <SelectItem key="PERSONAL" textValue="PERSONAL">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UserCircleIcon className="size-6" />
                  <span className="font-bold">Personal - PNS</span>
                </div>
              </SelectItem>
              <SelectItem key="UMPEG" textValue="UMPEG">
                <div className="flex flex-row items-center justify-start gap-x-2 p-4">
                  <UserGroupIcon className="size-6" />
                  <span className="font-bold">
                    Pengelola Kepegawaian (UMPEG)
                  </span>
                </div>
              </SelectItem>
            </Select> */}
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
                inputWrapper: "bg-white dark:bg-transparent",
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
                inputWrapper: "bg-white dark:bg-transparent",
              }}
              className="group"
            />
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-40 group"
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
              spinner={<Spinner color="current" variant="spinner" size="sm" />}
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
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-100/80"
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
          <BorderBeam
            duration={4}
            size={400}
            reverse
            className="from-transparent via-blue-300 to-transparent"
          />
          </form>
        </CardBody>
        <CardFooter>
          <span className="text-black/40 dark:text-white/40 text-sm text-center w-full">
            2024 &copy; Dikembangakan oleh Bidang PPIK - BKPSDM Balangan.
          </span>
        </CardFooter>
      </Card>
    </>
  );
}
