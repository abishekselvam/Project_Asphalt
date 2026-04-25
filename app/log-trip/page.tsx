import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import LogTripPageClient from "@/components/log-trip-page-client";

export default async function LogTripPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell email={session.user.email ?? ""} title="Log Trip">
      <LogTripPageClient />
    </AppShell>
  );
}
