"use client";

import { useActionState } from "react";
import { editPostAction, type EditPostState } from "@/actions/post";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: EditPostState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-destructive">{messages[0]}</p>;
}

type Category = { id: string; name: string; slug: string };
type Post = { id: string; title: string; body: string; categoryId: string | null };

export function EditPostForm({
  post,
  categories,
}: {
  post: Post;
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState(
    (prev: EditPostState, formData: FormData) =>
      editPostAction(post.id, prev, formData),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          标题
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={post.title}
        />
        <FieldError messages={state.errors?.title} />
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-sm font-medium">
          分类（可选）
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={post.categoryId ?? ""}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">不选择分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">
          正文（支持 Markdown）
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          defaultValue={post.body}
          className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="写下你的想法…"
        />
        <FieldError messages={state.errors?.body} />
      </div>

      <FieldError messages={state.errors?._form} />

      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit" disabled={pending}>
          {pending ? "保存中…" : "保存修改"}
        </Button>
        <a
          href={`/posts/${encodeURIComponent(post.id)}`}
          className="btn-outline"
          style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
        >
          取消
        </a>
      </div>
    </form>
  );
}
