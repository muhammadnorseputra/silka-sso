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
    <div className="group w-full flex flex-col items-center justify-center">
      {/* Left Side - Blue Section */}
      <div className="flex-1 rounded-b-2xl sm:max-w-150 bg-[url('/bg-home.png')] bg-cover p-12 flex flex-col justify-center text-white z-30 relative -top-5 group-hover:top-0 transition-all duration-200">
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
      <div className="flex-1 bg-white dark:bg-slate-800 p-8 flex rounded-b-2xl flex-col justify-center relative -top-5 z-20 group-hover:top-0 transition-all duration-400">
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
        </div>
      </div>
      {/* Footer */}
      <div className="flex-1 text-center p-4 dark:bg-slate-600 rounded-b-2xl mx-12 relative -top-5 group-hover:top-0 transition-all duration-600">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          &copy; 2024 | Dikembangakan oleh Bidang PPIK - BKPSDM Kab. Balangan.
        </p>
      </div>
    </div>
  );
}
