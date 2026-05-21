import { Suspense } from "react";
import { searchPosts } from "@/actions/search";
import { getHotTopics } from "@/actions/topic";
import { LeftColumn } from "@/components/layout/LeftColumn";
import { RightColumn } from "@/components/layout/RightColumn";
import { SearchResults } from "@/components/posts/SearchResults";
import { SearchBar } from "@/components/posts/SearchBar";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const keyword = q || "";

  return {
    title: keyword ? `搜索 "${keyword}" - AstroMaker 社区` : "搜索 - AstroMaker 社区",
    description: keyword ? `搜索 ${keyword} 相关帖子` : "搜索社区帖子",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q || "";

  const [hotTopics] = await Promise.all([
    getHotTopics(),
  ]);

  const results = keyword ? await searchPosts(keyword, 20) : [];
  const posts = Array.isArray(results) ? results : results;

  return (
    <div className="page-grid">
      <LeftColumn />
      <div className="col-center flex flex-col gap-4">
        {/* 搜索头部 */}
        <div className="feed-container" style={{ padding: "20px 24px" }}>
          <SearchBar initialValue={keyword} />
        </div>

        {/* 搜索结果 */}
        <Suspense fallback={<div style={{ padding: "32px", textAlign: "center", color: "var(--color-muted)" }}>搜索中...</div>}>
          <SearchResults
            posts={posts}
            total={posts.length}
            keyword={keyword}
          />
        </Suspense>
      </div>
      <RightColumn hotTopics={hotTopics} />
    </div>
  );
}
