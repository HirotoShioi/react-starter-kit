import { cn } from "@/lib/utils";
import { pageWrapperStyles } from "@/styles/common";

export default function TodosPage() {
  return (
    <div className={cn(pageWrapperStyles, "space-y-4")}>
      <h1 className="text-2xl">Chat</h1>
    </div>
  );
}
