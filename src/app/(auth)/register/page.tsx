import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">注册</h1>
      <p className="mb-6 text-muted">加入社区，开始交流。</p>
      <RegisterForm />
    </div>
  );
}
