export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen bg-brand-white">
      <Sidebar profile={user} />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
