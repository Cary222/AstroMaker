"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/actions/login";

const initialState: LoginState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

export function LoginForm({ registered }: { registered?: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {registered && (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          注册成功，请登录。
        </p>
      )}

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
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <FieldError messages={state.errors?._form} />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "登录中…" : "登录"}
      </button>

      <p className="text-center text-sm text-muted">
        还没有账号？{" "}
        <Link href="/register" className="text-accent hover:underline">
          注册
        </Link>
      </p>
    </form>
  );
}
