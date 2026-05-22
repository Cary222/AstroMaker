export type DateStyle = "medium" | "long";

export function formatDate(date: Date, style: DateStyle = "medium"): string {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: style,
    timeStyle: "short",
  }).format(date);
}
