import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCategories } from "@/lib/posts";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/posts/new");
  }

  const categories = await getCategories();

  return (
    <div className="edit-post-layout">
      <div className="edit-post-container">
        <div className="edit-post-back">
          <Link href="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12,19 5,12 12,5"/>
            </svg>
            返回首页
          </Link>
        </div>

        <div className="edit-post-card">
          <div className="edit-post-header">
            <h1 className="edit-post-title">发布帖子</h1>
            <p className="edit-post-subtitle">支持 Markdown 格式正文</p>
          </div>

          <CreatePostForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
