import { deletePostAction } from "@/actions/moderation";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deletePostAction(postId);
      }}
    >
      <button
        type="submit"
        className="text-sm text-red-400 hover:text-red-300"
      >
        删除帖子
      </button>
    </form>
  );
}
