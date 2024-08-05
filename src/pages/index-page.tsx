import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageWrapperStyles } from "@/styles/common";
import { Link } from "react-router-dom";

export default function IndexPage() {
  return (
    <div className={cn(pageWrapperStyles, "max-w-3xl space-y-8")}>
      <h1 className="text-2xl font-bold">My App</h1>
      <Button size={"lg"} asChild>
        <Link to="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
