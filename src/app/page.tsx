import SSOAccount from "@/components/sso-account";
import getSession from "@/hooks/session_server";
import { getSessionFromDatabase } from "@/services/session-store";
import Image from "next/image";
import { permanentRedirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  const shouldRedirect = true;

  const sessionFromDB = await getSessionFromDatabase(
    session?.token_plain as string,
  );

  if (sessionFromDB.status && shouldRedirect) {
    // Redirect to the dashboard if the user is already logged in
    permanentRedirect(
      `${process.env.NEXT_PUBLIC_PORTAL_SSO_BASE_URL as string}/${process.env.NEXT_PUBLIC_PORTAL_SSO_PATH as string}`,
    );
  }
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Side - Blue Section */}
      <div className="flex-1 sm:max-w-150 sm:rounded-r-2xl bg-[url('/bg-home.png')] bg-cover p-12 flex flex-col justify-center text-white">
        <div className="max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Logo Pemerintah Kabupaten Balangan"
              width={80}
              height={80}
              sizes="100vw"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 leading-tight">
            Akses Semua Layanan Kepegawaian Dengan Satu Portal SSO!
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-lg text-blue-100 leading-relaxed">
            Anda kini dapat mengunakan untuk berbagai platform. Nikmati
            kemudahan akses ke portal layanan kepegawaian melalui Single Sign On
            dalam satu akun.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white dark:bg-slate-900 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Selamat Datang 👋🏻
            </h2>
            <p className="text-gray-400">
              Silahkan pilih akun anda untuk melanjutkan...
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <SSOAccount />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Kab.
              Balangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
