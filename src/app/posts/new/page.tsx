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
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold">发布帖子</h1>
      <p className="mb-6 text-muted">支持 Markdown 格式正文。</p>
      <CreatePostForm categories={categories} />
    </div>
  );
}
