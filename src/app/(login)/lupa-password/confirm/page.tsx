import { forbidden, unauthorized } from "next/navigation";
import Confirm from "./confirm";
import { cookies } from "next/headers";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface Payload extends JwtPayload {
  data: any;
}

function uuidValidateV4(uuid: string | undefined) {
  return uuidValidate(uuid) && uuidVersion(uuid as string) === 4;
}

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{
    readonly [key: string]: string | string[] | undefined;
  }>;
}) {
  const { state: stateBrowser } = await searchParams;
  const cookieStore = await cookies();
  const state = cookieStore.get("otp_state")?.value;
  const access_token = cookieStore.get("otp_access_token")?.value;
  if (!state || !uuidValidateV4(state) || state !== stateBrowser) {
    return forbidden();
  }
  const decoded = jwtDecode<Payload>(access_token as string);
  if (!access_token) {
    return unauthorized();
  }

  return <Confirm access_token={access_token} decoded={decoded} />;
}
