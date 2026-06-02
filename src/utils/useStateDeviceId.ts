"use client";

import { getCookie, setCookie } from "cookies-next/client";
import { useState, useEffect } from "react";

export function useStateDeviceId() {
  // 1. Berikan nilai awal null agar sinkron dengan Server-Side Rendering (SSR)
  const [stateDeviceId, setStateDeviceId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // 2. Kode ini hanya berjalan di sisi klien (browser) setelah komponen mount
    const key = "device_id_state";
    let currentId = localStorage.getItem(key);
    const currentIdFromCookie = getCookie(key) as string;

    const finalDeviceId = currentIdFromCookie || currentId;

    // Jika belum ada device_id di localStorage, buat baru (menggunakan crypto.randomUUID)
    if (!finalDeviceId) {
      currentId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2) + Date.now().toString(36); // Fallback jika browser lama

      setCookie(key, currentId, { maxAge: 365 * 24 * 60 * 60 }); // Simpan di cookie untuk akses server
      localStorage.setItem(key, currentId);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeviceId(finalDeviceId);
    setStateDeviceId(finalDeviceId);
  }, []);

  // 3. Fungsi opsional jika suatu saat Anda ingin mereset atau mengubah device_id manual
  const resetStateDeviceId = () => {
    const key = "device_id_state";
    const newId = crypto.randomUUID();
    localStorage.setItem(key, newId);
    setStateDeviceId(newId);
  };

  const resetDeviceId = () => {
    const key = "device_id_state";
    const newId = crypto.randomUUID();
    setCookie(key, newId, { maxAge: 365 * 24 * 60 * 60 });
    setDeviceId(newId);
  };

  return { stateDeviceId, deviceId, resetStateDeviceId, resetDeviceId };
}
