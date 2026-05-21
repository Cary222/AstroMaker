"use client";

import { useActionState } from "react";
import {
  createPostAction,
  type CreatePostState,
} from "@/actions/post";

const initialState: CreatePostState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-400">{messages[0]}</p>;
}

type Category = { id: string; name: string; slug: string };

export function CreatePostForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-muted">
          标题
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-accent"
        />
        <FieldError messages={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm text-muted">
          分类（可选）
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue=""
          className="w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-accent"
        >
          <option value="">不选择分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="body" className="mb-1 block text-sm text-muted">
          正文（支持 Markdown）
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm outline-none focus:border-accent"
          placeholder="写下你的想法…"
        />
        <FieldError messages={state.errors?.body} />
      </div>

      <FieldError messages={state.errors?._form} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "发布中…" : "发布帖子"}
      </button>
    </form>
  );
}
