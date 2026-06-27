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
    <main className="relative min-h-screen flex">
      {/* Left — Hero Panel */}
      <aside className="hidden lg:flex lg:w-1/2 relative bg-hero-gradient overflow-hidden">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid" />

        {/* Decorative glowing orbs */}
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo + badge */}
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3">
              <Image
                src="/logo.png"
                alt="Logo Pemerintah Kabupaten Balangan"
                width={36}
                height={36}
                className="w-auto h-auto"
              />
              {/* <span className="text-sm font-medium text-white/80 tracking-wide">
                BKPSDM Kab. Balangan
              </span> */}
            </div>
          </div>

          {/* Heading block */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl/tight xl:text-5xl/tight font-bold text-white">
              Akses Semua Layanan Kepegawaian
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-indigo-200">
                Dengan Satu Portal
              </span>
            </h1>
            <p className="text-base leading-relaxed text-blue-200/80">
              Nikmati kemudahan akses ke portal layanan kepegawaian melalui
              Single Sign On dalam satu akun.
            </p>
          </div>

          {/* Bottom stat */}
          <div className="flex items-center gap-2 text-xs text-blue-300/50">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
            Sistem terintegrasi — SILKa Online
          </div>
        </div>
      </aside>

      {/* Right — Login Panel */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 bg-white dark:bg-deep-navy">

        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20 mb-6">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-300 dark:text-white">
              Selamat Datang
            </h2>
            <p className="text-gray-400 dark:text-gray-500 mt-1.5 text-sm">
              Silakan pilih akun untuk melanjutkan
            </p>
          </div>

          {/* Account selector */}
          <div className="space-y-4">
            <SSOAccount />
          </div>

          {/* Footer */}
          <p className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
            2024 &copy; Dikembangkan oleh Bidang PPIK, BKPSDM Kab. Balangan.
          </p>
        </div>
      </section>
    </main>
  );
}
