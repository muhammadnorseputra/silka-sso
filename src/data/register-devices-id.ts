"use server";
import { cookies } from "next/headers";
import GetDevicesInfo from "./get-devices-info";

export default async function RegisterDevicesId(FormFileds: any) {
  const url = `${process.env.NEXT_PUBLIC_SILKA_BASE_URL}`;
  const devicesInfo = await GetDevicesInfo();
  // get cookie device_id
  const cookieStore = await cookies();
  const device_id = cookieStore.get("device_id")?.value;

  const sendRequest = {
    user_id: devicesInfo.user_id || FormFileds.user_id,
    user_label: devicesInfo.user_label || FormFileds.user_label,
    device_id: device_id || "",
    user_agent: devicesInfo.userAgent,
    ip: devicesInfo.ip,
    browser: devicesInfo.browser,
    os: devicesInfo.os,
    device: devicesInfo.device,
    model: devicesInfo.model,
    vendor: devicesInfo.vendor,
    is_bot: devicesInfo.isBot,
  };
  try {
    const req = await fetch(
      `${url}/${process.env.NEXT_PUBLIC_VERSION}/pendaftaran/devices`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          apiKey: process.env.NEXT_PUBLIC_APIKEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendRequest),
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

    /**
     * Set Cookie device_id
     * Expire in 1 year
     */
    cookieStore.set({
      name: "device_id",
      value: result.data.device_id,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === "production",
    });

    return {
      status: true,
      message: result.message || "Berhasil mendaftarkan perangkat",
      device_id: result.data.device_id,
    };
  } catch (err) {
    return {
      status: false,
      message: `Gagal koneksi ke server ${url} (${err})`,
    };
  }
}
