import { DashboardContent } from "@/components/dashboard-content";
import ListClients from "@/data/list-client";
export default async function Page() {
  const clients = await ListClients();
  return <DashboardContent clients={clients} />;
}
