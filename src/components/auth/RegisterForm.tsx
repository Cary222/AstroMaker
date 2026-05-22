"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: RegisterState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-destructive">{messages[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          显示名称
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="你的名字"
        />
        <FieldError messages={state.errors?.name} />
      </div>

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
          minLength={8}
          autoComplete="new-password"
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          确认密码
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <FieldError messages={state.errors?.confirmPassword} />
      </div>

      <FieldError messages={state.errors?._form} />

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "注册中…" : "注册"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        已有账号？{" "}
        <Link href="/login" className="text-accent hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
