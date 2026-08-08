import SSOAccount from "@/components/sso-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { BorderBeam } from "@/components/ui/border-beam";
import { GridPattern } from "@/components/ui/grid-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { TextAnimate } from "@/components/ui/text-animate";
import { TypingAnimation } from "@/components/ui/typing-animation";
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
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-white lg:flex-row dark:bg-brand-teal-deep">
      {/* Left — Hero Panel (deep teal band, both modes) */}
      <aside className="relative hidden overflow-hidden lg:flex lg:w-[55%] xl:w-1/2">
        {/* Animated teal gradient */}
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid" />
        {/* Meteors */}
        <Meteors number={10} className="bg-emerald-300/70" />
        {/* Decorative glowing orbs */}
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between gap-20 p-10 xl:p-16">
          {/* Logo + badge */}
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
              <Image
                src="/logo.png"
                alt="Logo Pemerintah Kabupaten Balangan"
                width={28}
                height={28}
                className="h-auto w-auto"
              />
              <span className="text-xs font-semibold tracking-wide text-white/80">
                SILKa Online
              </span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-brand-green">
              <span className="relative inline-flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
              </span>
              Single Sign On
            </span>
          </div>

          {/* Heading block */}
          <div className="max-w-lg space-y-6">
            <TextAnimate
              as="p"
              animation="fadeIn"
              by="text"
              once
              className="text-[11px] font-semibold uppercase tracking-[1px] text-brand-green"
            >
              Satu Akun · Semua Layanan
            </TextAnimate>
            <TextAnimate
              as="h1"
              animation="blurInUp"
              by="word"
              once
              className="text-4xl/tight font-bold text-white sm:text-5xl/tight xl:text-6xl/tight"
            >
              Akses Semua Layanan Kepegawaian
            </TextAnimate>
            <div className="h-px w-24 bg-linear-to-r from-brand-green to-transparent" />
            <TypingAnimation
              as="p"
              cursorStyle="line"
              deleteSpeed={20}
              loop
              className="text-sm leading-relaxed text-white/60 sm:text-base"
            >
              Nikmati kemudahan akses ke portal layanan kepegawaian melalui
              Single Sign On dalam satu akun.
            </TypingAnimation>
          </div>

          {/* Bottom status */}
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green/50" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-green" />
            </span>
            Sistem terintegrasi — SILKa Online
          </div>
        </div>
      </aside>

      {/* Right — Login Panel */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-6 lg:px-16 lg:py-12">
        <GridPattern
          width={60}
          height={60}
          strokeDasharray="2"
          className="fill-steel/15 stroke-steel/15 dark:fill-white/10 dark:stroke-white/10"
        />

        {/* Theme toggle */}
        <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        {/* Mobile hero band — brand strip + headline (visible < lg) */}
        <div className="relative z-10 mb-8 w-full max-w-md lg:hidden">
          <div className="relative overflow-hidden rounded-2xl bg-hero-gradient px-6 py-8">
            {/* Dot grid overlay */}
            <div className="absolute inset-0 bg-dot-grid" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                  <Image
                    src="/logo.png"
                    alt="Logo Pemerintah Kabupaten Balangan"
                    width={22}
                    height={22}
                    className="h-auto w-auto"
                  />
                  <span className="text-xs font-semibold text-white/90">
                    SILKa Online
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-brand-green">
                  SSO
                </span>
              </div>
              <TextAnimate
                as="p"
                animation="fadeIn"
                by="text"
                once
                className="text-[11px] font-semibold uppercase tracking-[1px] text-brand-green"
              >
                Satu Akun · Semua Layanan
              </TextAnimate>
              <h1 className="text-2xl/tight font-bold text-white">
                Akses Semua Layanan Kepegawaian
              </h1>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="relative z-10 w-full max-w-md">
          <MagicCard
            mode="orb"
            glowFrom="#00ed64"
            glowTo="#7b3ff2"
            glowSize={380}
            glowBlur={70}
            glowOpacity={0.45}
            className="rounded-xl bg-white shadow-none dark:bg-brand-teal-deep"
          >
            <BorderBeam
              size={140}
              duration={9}
              colorFrom="#00ed64"
              colorTo="#7b3ff2"
              borderWidth={1}
              className="opacity-40"
            />
            <div className="relative rounded-xl border border-hairline bg-surface/90 p-7 backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-[#0a1824]/90">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-xl border border-brand-green/30 bg-brand-green-soft text-brand-green-dark dark:bg-brand-green/15 dark:text-brand-green">
                  <svg
                    className="size-6"
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
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[1px] text-brand-green-dark dark:text-brand-green">
                  SSO · SILKa Online
                </p>
                <h2 className="text-2xl font-semibold text-ink sm:text-3xl dark:text-white">
                  Selamat Datang
                </h2>
                <p className="mt-2 text-sm text-steel sm:text-base dark:text-white/60">
                  Silakan pilih akun untuk melanjutkan
                </p>
              </div>

              {/* Account selector */}
              <div className="space-y-3">
                <SSOAccount />
              </div>

              {/* Footer */}
              <p className="mt-10 text-center text-xs text-stone dark:text-white/40">
                2024 &copy; Dikembangkan oleh Bidang PPIK, BKPSDM Kab. Balangan.
              </p>
            </div>
          </MagicCard>
        </div>
      </section>
    </main>
  );
}
