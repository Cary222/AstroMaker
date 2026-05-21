"use client";

import { useActionState, useState } from "react";
import { editPostAction, type EditPostState } from "@/actions/post";
import { ImageUploader } from "./ImageUploader";
import { TopicInput } from "./TopicInput";

const initialState: EditPostState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="field-error">{messages[0]}</p>;
}

type Category = { id: string; name: string; slug: string };
type Post = {
  id: string;
  title: string;
  body: string;
  categoryId: string | null;
  images: string[];
  tags: { topic: { id: string; name: string; slug: string } }[];
};

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
  const [images, setImages] = useState<string[]>(post.images || []);
  const [tags, setTags] = useState<string[]>(
    post.tags?.map((t) => t.topic.name) ?? []
  );

  return (
    <form action={formAction} className="post-form">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="tags" value={tags.join(",")} />

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          标题
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={post.title}
          className="form-input"
          placeholder="请输入帖子标题"
        />
        <FieldError messages={state.errors?.title} />
      </div>

      <div className="form-group">
        <label htmlFor="categoryId" className="form-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
          分类（可选）
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={post.categoryId ?? ""}
          className="form-select"
        >
          <option value="">不选择分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 标签输入 */}
      <TopicInput
        value={tags}
        onChange={setTags}
        maxTags={5}
        placeholder="添加标签..."
      />

      <div className="form-group">
        <label htmlFor="body" className="form-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="17" y1="10" x2="3" y2="10"/>
            <line x1="21" y1="6" x2="3" y2="6"/>
            <line x1="21" y1="14" x2="3" y2="14"/>
            <line x1="17" y1="18" x2="3" y2="18"/>
          </svg>
          正文（支持 Markdown）
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          defaultValue={post.body}
          className="form-textarea"
          placeholder="写下你的想法，使用 Markdown 格式..."
        />
        <FieldError messages={state.errors?.body} />
      </div>

      {/* 图片上传组件 */}
      <ImageUploader onImagesChange={setImages} maxImages={9} initialImages={post.images || []} />

      <FieldError messages={state.errors?._form} />

      <div className="form-actions">
        <button type="submit" disabled={pending} className="submit-btn">
          {pending ? (
            <>
              <svg className="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
              </svg>
              保存中…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              保存修改
            </>
          )}
        </button>
        <a
          href={`/posts/${encodeURIComponent(post.id)}`}
          className="cancel-btn"
        >
          取消
        </a>
      </div>
    </form>
  );
}
