import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getHotTopics } from "@/actions/topic";
import { LeftColumn } from "@/components/layout/LeftColumn";
import { Feed } from "@/components/posts/Feed";
import { RightColumn } from "@/components/layout/RightColumn";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await prisma.topic.findUnique({
    where: { slug },
    select: { name: true, posts: true },
  });

  if (!topic) {
    return { title: "标签未找到" };
  }

  return {
    title: `#${topic.name} - AstroMaker 社区`,
    description: `浏览关于 #${topic.name} 的 ${topic.posts} 篇帖子`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  const [topic, hotTopics] = await Promise.all([
    prisma.topic.findUnique({
      where: { slug },
      include: {
        postTags: {
          include: {
            post: {
              include: {
                author: { select: { id: true, name: true, image: true } },
                _count: { select: { comments: true } },
              },
            },
          },
        },
      },
    }),
    getHotTopics(10),
  ]);

  if (!topic) {
    notFound();
  }

  // Extract posts from topic
  const posts = topic!.postTags
    .map((pt) => pt.post)
    .filter((post) => post.published);

  return (
    <div className="page-grid">
      <LeftColumn />
      <div className="col-center">
        {/* Tag header */}
        <div className="tag-header">
          <div className="tag-header-icon">#</div>
          <div className="tag-header-info">
            <h1 className="tag-header-name">{topic!.name}</h1>
            <p className="tag-header-count">{topic!.posts} 篇帖子</p>
          </div>
        </div>

        {/* Posts */}
        <Feed posts={posts} />
      </div>
      <RightColumn hotTopics={hotTopics} />
    </div>
  );
}
