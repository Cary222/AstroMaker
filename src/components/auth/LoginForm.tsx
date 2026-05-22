"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/actions/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: LoginState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-destructive">{messages[0]}</p>;
}

export function LoginForm({ registered }: { registered?: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {registered && (
        <p className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          注册成功，请登录。
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
        />
        <FieldError messages={state.errors?.email} />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          密码
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <FieldError messages={state.errors?._form} />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "登录中…" : "登录"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        还没有账号？{" "}
        <Link href="/register" className="text-accent hover:underline">
          注册
        </Link>
      </p>
    </form>
  );
}
