import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const registered = params.registered === "1";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">登录</h1>
      <p className="mb-6 text-muted">欢迎回来。</p>
      <LoginForm registered={registered} />
    </div>
  );
}
