import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageWrapperStyles } from "@/styles/common";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link, useNavigate } from "react-router-dom";

export default function IndexPage() {
  const { user } = useAuthenticator((c) => [c.user]);
  const navigate = useNavigate();
  if (user) {
    navigate("/todos");
    return null;
  }
  return (
    <div className={cn(pageWrapperStyles, "max-w-3xl space-y-4")}>
      <h1 className="text-2xl font-bold">My App</h1>
      <Button size={"lg"} asChild>
        <Link to="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
