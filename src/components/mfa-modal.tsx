"use client";
import { getCookie } from "cookies-next/client";
import { AES, enc } from "crypto-js";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const BASE_URL = "/";

const TwoFactorModal = () => {
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);

  const [qrImage, setQrImage] = useState<string | undefined>();
  const [secret, setSecret] = useState<string | undefined>();

  const access_token = getCookie("sso_token");
  const access_token_dc = AES.decrypt(
    access_token || "",
    process.env.NEXT_PUBLIC_KEY_PASSPHRASE || "bkpsdm@6811",
  ).toString(enc.Utf8);

  /* Generate a QR */
  const get2faQrCode = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/mfa/qrcode`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && data?.status === 200) {
        setQrImage(data.data);
        setSecret(data.secret);
      }
    } catch (error) {
      console.error("Failed to fetch 2FA QR code", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    get2faQrCode();
  }, []);

  /* Validate Code  */
  const handleOtpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    setInvalidOtp(false);

    if (value.length === 6) {
      try {
        const response = await fetch(`${BASE_URL}api/mfa/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secret, token: value, access_token_dc }),
        });

        const data = await response.json();

        if (!response.ok || !data?.verified) {
          setInvalidOtp(true);
        }
      } catch (error) {
        console.error("Failed to verify OTP", error);
        setInvalidOtp(true);
      }
    }
  };

  return (
    <div className="flex justify-end w-full">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-1 justify-center items-center p-4 text-white rounded-md">
            {qrImage && (
              <Image
                width={200}
                height={200}
                src={qrImage}
                alt="2FA QR Code"
                className="rounded-lg border-2"
              />
            )}
          </div>

          <div className="flex-1 p-4 text-white rounded-md">
            <p className="text-2xl text-gray-700 font-bold mb-4">
              Use an Authenticator App to enable 2FA
            </p>
            <ul className="list-none list-inside mb-4 text-gray-700">
              <li className="mb-2">
                <span className="font-bold">Step 1:</span> Scan the QR Code with
                your Authenticator app.
              </li>
              <li className="mb-2">
                <span className="font-bold">Step 2:</span> Enter the code below
                from your app.
              </li>
            </ul>

            {/* OTP Input */}
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
            />

            {/* Invalid Input */}
            {
              <p className="mt-3 text-red-500 text-sm text-center">
                {invalidOtp && "*Invalid Code"}
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
