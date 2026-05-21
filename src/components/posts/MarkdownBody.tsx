import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="markdown space-y-3 text-foreground leading-relaxed">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  );
}
