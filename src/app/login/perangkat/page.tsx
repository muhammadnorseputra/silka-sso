import FormDevice from "./form-device";
import GetDevicesInfo from "@/data/get-devices-info";

export const metadata = {
    title: "Register Device - SSO Silka",
    description: "Register your device to access the SSO Silka platform securely.",
};

export default async function Page() {
    const devicesInfo = await GetDevicesInfo();
    return (
        <FormDevice device={devicesInfo} />
    )
}
