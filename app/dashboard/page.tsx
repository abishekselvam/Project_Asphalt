import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import DashboardOverview from "@/components/dashboard-overview";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell email={session.user.email ?? ""} title="Dashboard">
      <DashboardOverview />
    </AppShell>
  );
}
