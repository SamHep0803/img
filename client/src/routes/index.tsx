import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const session = authClient.useSession();

  console.log(session);

  return session.data ? (
    <div>
      {JSON.stringify(session.data?.user)}

      <Button
        onClick={async () => {
          await authClient.signOut();
        }}
      >
        Logout
      </Button>
    </div>
  ) : (
    <div>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: "sml",
            callbackURL: "http://localhost:5173",
          });
        }}
      >
        Login
      </Button>
    </div>
  );
}

export default Index;
