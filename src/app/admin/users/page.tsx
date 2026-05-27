import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isModerator } from "@/lib/permissions";
import { UserManagementClient } from "@/components/admin/UserManagementClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          管理员 · {session.user.name ?? session.user.email}
        </p>
      </div>

      <UserManagementClient />
    </div>
  );
}
