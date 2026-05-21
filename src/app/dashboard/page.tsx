import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h1 className="text-2xl font-bold">控制台</h1>
      <p className="mt-2 text-muted">
        此页面受 middleware 保护，仅登录用户可访问。
      </p>
      <p className="mt-4">
        你好，{session.user.name ?? session.user.email}。
      </p>
    </div>
  );
}
