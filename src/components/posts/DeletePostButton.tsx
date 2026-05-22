import { deletePostAction } from "@/actions/moderation";
import { Button } from "@/components/ui/button";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form action={async () => {
      "use server";
      await deletePostAction(postId);
    }}>
      <Button variant="destructive" size="sm" type="submit">
        删除帖子
      </Button>
    </form>
  );
}
