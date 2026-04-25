import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import SettingsPageClient from "@/components/settings-page-client";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell email={session.user.email ?? ""} title="Settings">
      <SettingsPageClient />
    </AppShell>
  );
}
