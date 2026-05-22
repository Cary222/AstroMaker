import { signOutAction } from "@/actions/signout";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="ghost" size="sm" type="submit">
        退出
      </Button>
    </form>
  );
}
