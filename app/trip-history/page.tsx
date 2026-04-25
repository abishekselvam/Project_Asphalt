import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import TripHistoryPageClient from "@/components/trip-history-page-client";

export default async function TripHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell email={session.user.email ?? ""} title="Trip History">
      <TripHistoryPageClient />
    </AppShell>
  );
}
