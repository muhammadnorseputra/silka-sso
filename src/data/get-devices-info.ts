"use server";

import { userAgent } from "next/server";
import { cookies, headers } from "next/headers";

async function fetchDeviceApi(
  device_id: any,
  browser: any,
  os: any,
  model: any,
  vendor: any,
  device: any,
) {
  const url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}`;
  try {
    const req = await fetch(
      `${url}/${process.env.NEXT_PUBLIC_VERSION}/pendaftaran/devices?device_id=${device_id}&browser=${browser}&os=${os}&model=${model}&vendor=${vendor}&device=${device}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await req.json();

    if (!req.ok) {
      return {
        status: false,
        message: result.message || `Gagal koneksi ke server ${url}`,
      };
    }

    if (!result.status) {
      return {
        status: false,
        message: result.message || `Gagal koneksi ke server ${url} database`,
      };
    }

    return result;
  } catch (error) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${url} error: ${error}`,
    };
  }
}

export default async function GetDevicesInfo() {
  const headersList = await headers();
  // get cookie device_id
  const cookieStore = await cookies();
  const device_id_from_cookie = cookieStore.get("device_id")?.value || "";
  /**
   * Get IP Address
   * Support:
   * - Vercel
   * - Nginx
   * - Cloudflare
   * - Localhost
   */
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const cfConnectingIp = headersList.get("cf-connecting-ip");

  const ip =
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(",")[0]?.trim() ||
    "127.0.0.1";
  /**
   * Get User Agent
   */
  const ua = headersList.get("user-agent") || "";

  const { isBot, browser, device, os } = userAgent({
    headers: {
      get(name: string) {
        return headersList.get(name);
      },
    },
  } as any);

  // get info device from api /pendaftaran/devices?browser=Chrome&os=Mac OS&model=Macintosh&vendor=Apple&device=desktop&is_bot=0
  const deviceInfo = await fetchDeviceApi(
    device_id_from_cookie,
    browser.name,
    os.name,
    device.model,
    device.vendor,
    device.type || "desktop",
  );

  console.log("device_info", deviceInfo);
  console.log(
    "req",
    device_id_from_cookie,
    browser.name,
    os.name,
    device.model,
    device.vendor,
    device.type || "desktop",
  );

  if (deviceInfo.status) {
    return {
      user_id: deviceInfo.data.user_id,
      user_label: deviceInfo.data.user_label,
      device_id: deviceInfo.data.device_id,
      isBot: deviceInfo.data.is_bot,
      ip: deviceInfo.data.ip,
      userAgent: deviceInfo.data.user_agent,
      browser: deviceInfo.data.browser,
      device: deviceInfo.data.device,
      model: deviceInfo.data.model,
      vendor: deviceInfo.data.vendor,
      os: deviceInfo.data.os,
    };
  }

  return {
    user_id: null,
    user_label: null,
    device_id: null,
    ip,
    userAgent: ua,
    browser: browser.name,
    device: device.type || "desktop",
    model: device.model || "-",
    vendor: device.vendor || "-",
    os: os.name,
    isBot,
  };
}
