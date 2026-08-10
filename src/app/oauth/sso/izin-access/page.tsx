import { GridPattern } from "@/components/ui/grid-pattern";
import Image from "next/image";
import { LinkIcon } from "@heroicons/react/24/outline";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import verifyClient from "@/data/verify-client";
import { cancelConsent } from "@/app/actions/cancel-consent";
import { approveConsent } from "@/app/actions/approve-consent";
import { ConsentActions } from "./consent-actions";

interface ConsentPayload {
  client_id?: string;
  client_name?: string;
  client_secret?: string;
  redirect_uri?: string;
  state?: string;
  scope?: string;
  response_type?: string;
  is_consent?: boolean;
  code?: string;
  client_logo_url?: string;
  nip?: string;
  username?: string;
  level?: string;
}

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{
    readonly [key: string]: string | string[] | undefined;
  }>;
}) {

  const query = await searchParams;

  const parseParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const state = (parseParam(query?.state) || "").replace(/^"+|"+$/g, "");
  
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("sso_consent");
  const consentErrorCookie = cookieStore.get("sso_consent_error");
  const consentStateCookie = cookieStore.get("sso_consent_state");

  let consent: ConsentPayload | null = null;
  if (consentCookie?.value) {
    consent = JSON.parse(consentCookie.value) as ConsentPayload;
  } else {
    const clientId = parseParam(query?.client_id);
    const clientName = parseParam(query?.client_name);
    const responseType = parseParam(query?.response_type);
    const redirectUri = parseParam(query?.redirect_uri);

    const response = await verifyClient(
      clientId,
      responseType,
      redirectUri,
      state,
      clientName,
    );

    if (!response.status) {
      unauthorized();
    }

    consent = {
      client_id: clientId,
      client_name: clientName,
      client_secret: parseParam(query?.client_secret),
      redirect_uri: redirectUri,
      state: parseParam(query?.state),
      scope: parseParam(query?.scope),
      response_type: responseType,
      is_consent: query?.is_consent === "true" || query?.is_consent === "1",
      code: parseParam(query?.code),
      client_logo_url: parseParam(query?.client_logo_url),
      nip: parseParam(query?.nip),
      username: parseParam(query?.username),
      level: parseParam(query?.level),
    };
  }


  const appName = consent.client_name || "Aplikasi";
  const redirectUri = consent.redirect_uri || "";
  const logoUrl = consent.client_logo_url || "";
  const scope = consent.scope || "";
  const scopeLabels = scope
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const consentErrorMessage = consentErrorCookie?.value || "";
  const consentState = consentStateCookie?.value || "";
  const nip = consent.nip || "-";
  const username = consent.username || "-";

  const fallbackParams: Record<string, string> = {
    client_id: parseParam(query?.client_id) || "",
    client_secret: parseParam(query?.client_secret) || "",
    redirect_uri: parseParam(query?.redirect_uri) || "",
    state: parseParam(query?.state) || "",
    scope: parseParam(query?.scope) || "",
    response_type: parseParam(query?.response_type) || "",
    code: parseParam(query?.code) || "",
    client_logo_url: parseParam(query?.client_logo_url) || "",
    nip: parseParam(query?.nip) || "",
    username: parseParam(query?.username) || "",
    level: parseParam(query?.level) || "",
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#eef8ee] via-[#f8faf7] to-[#d8ebe2] px-4 py-8 sm:px-6 dark:bg-linear-to-br dark:from-[#10251f] dark:via-[#143b34] dark:to-[#071b17]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(121,176,154,0.20),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(236,253,244,0.10),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(64,138,108,0.30),transparent_65%)]" />
      <GridPattern
        width={40}
        height={40}
        strokeDasharray="2"
        className="fill-emerald-950/4 stroke-emerald-950/20 dark:fill-white/4 dark:stroke-emerald-50/20"
      />

      <section className="relative z-10 w-full max-w-xl rounded-[32px] border border-emerald-900/15 bg-[#effaf3]/95 shadow-xl shadow-emerald-950/10 overflow-hidden sm:rounded-[36px] dark:border-emerald-100/15 dark:bg-[#122b24]/95 dark:shadow-black/50">
        <div className="border-b border-emerald-900/10 px-5 py-7 sm:px-8 sm:py-8 dark:border-emerald-50/10">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-3">
            <div className="relative flex items-center justify-center">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-lg shadow-cyan-900/30 sm:h-24 sm:w-24 dark:border-emerald-50/15 dark:bg-[#183b31] dark:shadow-black/40">
                <Image
                  src="/logo.png"
                  alt="Portal SSO"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
              </div>
              <span className="absolute -bottom-2 rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-950 dark:bg-emerald-300 dark:text-slate-950">
                SSO
              </span>
            </div>

            <div className="relative flex items-center justify-center py-1">
              <div className="h-px w-10 bg-linear-to-r from-emerald-500 to-emerald-500 sm:w-14 dark:from-emerald-300 dark:to-emerald-300" />
              <div className="grid h-9 w-9 place-items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 sm:h-10 sm:w-10 dark:border-emerald-300/60 dark:bg-emerald-300/10">
                <LinkIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-300" aria-hidden="true" />
              </div>
              <div className="h-px w-10 bg-linear-to-r from-emerald-500 to-emerald-500 sm:w-14 dark:from-emerald-300 dark:to-emerald-300" />
            </div>

            <div className="relative flex items-center justify-center">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-lg shadow-emerald-900/30 sm:h-24 sm:w-24 dark:border-emerald-50/15 dark:bg-[#183b31] dark:shadow-black/40">
                {logoUrl ? (
                  <div
                    aria-label={appName}
                    className="h-full w-full rounded-xl bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${logoUrl}')` }}
                  />
                ) : (
                  <span className="text-xl font-black text-slate-900">{appName.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <span className="absolute -bottom-2 rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-950 dark:bg-emerald-300 dark:text-slate-950">
                Client
              </span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-500/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900 dark:border-emerald-50/20 dark:bg-emerald-200/8 dark:text-emerald-50">
              <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300" />
              Authorize application
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-emerald-50">
              {appName}
            </h1>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-emerald-50/60">
              SILKa Single Sign-On
            </p>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm shadow-slate-900/5 sm:p-6 dark:border-emerald-50/10 dark:bg-[#143d34]/80 dark:shadow-black/30">
            {consentErrorMessage ? (
              <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-300/40 dark:bg-rose-950/50 dark:text-rose-100">
                {consentErrorMessage}
              </div>
            ) : null}

            <div className="flex items-start gap-4">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-emerald-50">
                  Aplikasi <span className="text-slate-600 dark:text-emerald-100/75">{appName}</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-emerald-50/70">
                  Dengan melanjutkan, Anda mengizinkan aplikasi ini untuk mengakses data yang diperlukan sesuai kebijakan privasi dan persyaratan layanan kami.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-emerald-50/15 dark:bg-[#203f33]/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-50/65">
                  Informasi pengguna
                </span>
                <span className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-900 dark:border-emerald-50/25 dark:bg-emerald-100/10 dark:text-emerald-50">
                  SSO Identity
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-emerald-50/12 dark:bg-[#183b31]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-emerald-50/65">
                    NIP
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-emerald-50">
                    {nip}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-emerald-50/12 dark:bg-[#183b31]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-emerald-50/65">
                    Username
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900 dark:text-emerald-50">
                    {username}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-50/65">Redirect URI</span>
                <span className="max-w-full truncate text-left text-xs font-semibold text-slate-700 sm:max-w-[360px] sm:text-right dark:text-emerald-50/85">
                  {redirectUri}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-50/65">Scope</span>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {scopeLabels.length > 0 ? (
                    scopeLabels.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-50/20 dark:bg-emerald-200/10 dark:text-emerald-50"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 dark:text-emerald-50/75">Tidak ada scope</span>
                  )}
                </div>
              </div>
            </div>

            <ConsentActions
              state={state || consentState}
              fallbackParams={fallbackParams}
              cancelAction={cancelConsent}
              approveAction={approveConsent}
            />
          </div>
        </div>
      </section>
    </main>
  );
}