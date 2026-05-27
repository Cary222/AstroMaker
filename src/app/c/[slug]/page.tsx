import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFeedPosts } from "@/actions/feed";
import { getCategories } from "@/lib/posts";
import { getHotTopics } from "@/actions/topic";
import { LeftColumn } from "@/components/layout/LeftColumn";
import { CenterColumn } from "@/components/layout/CenterColumn";
import { RightColumn } from "@/components/layout/RightColumn";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "分类未找到" };
  }

  return {
    title: `${category.name} - AstroMaker 社区`,
    description: `浏览 ${category.name} 分类下的所有帖子`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const [session, hotTopics] = await Promise.all([auth(), getHotTopics()]);

  const initial = await getFeedPosts({ tab: "latest", categorySlug: slug, limit: 20 });

  return (
    <div className="page-grid">
      <LeftColumn currentCategory={slug} />
      <CenterColumn
        session={session}
        initialPosts={initial.posts}
        initialCursor={initial.nextCursor}
        categoryName={category.name}
        categorySlug={slug}
      />
      <RightColumn hotTopics={hotTopics} />
    </div>
  );
}
