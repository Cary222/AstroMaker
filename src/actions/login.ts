"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { CredentialsSignin } from "next-auth";

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      const msg = (err as CredentialsSignin).message;
      if (msg?.includes("封禁")) {
        return { errors: { _form: ["账号已被封禁，请联系管理员"] } };
      }
    }
    return { errors: { _form: ["邮箱或密码错误"] } };
  }

  redirect("/");
}
