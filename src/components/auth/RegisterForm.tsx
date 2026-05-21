"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/actions/register";

const initialState: RegisterState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-muted">
          显示名称
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.name} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-muted">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.email} />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-muted">
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm text-muted"
        >
          确认密码
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.confirmPassword} />
      </div>

      <FieldError messages={state.errors?._form} />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "注册中…" : "注册"}
      </button>

      <p className="text-center text-sm text-muted">
        已有账号？{" "}
        <Link href="/login" className="text-accent hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
