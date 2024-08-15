import { cn } from "@/lib/utils";
import { pageWrapperStyles } from "@/styles/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon } from "lucide-react";
import {
  ActionFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { Todo } from "@/data-access/todo.model";
import { deleteTodo, getTodos, updateTodo } from "@/use-cases/todos";
import CreateTodoForm from "@/components/create-todo-form";

export type TodoPageLoaderProps = {
  todos: Todo[];
};

export async function loader() {
  return {
    todos: await getTodos(),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  if (request.method === "DELETE") {
    const todoId = form.get("todoId");
    if (typeof todoId === "string") {
      await deleteTodo(Number(todoId));
    }
  }
  if (request.method === "PUT") {
    const todo = form.get("todo");
    if (todo) {
      const parsed = JSON.parse(todo as string) as {
        id: number;
        completed: boolean;
      };
      await updateTodo({
        id: parsed.id,
        completed: parsed.completed,
      });
    }
  }
  return new Response(null, { status: 302, headers: { Location: "/todos" } });
}

export function TodoItem({ id, title, completed }: Todo) {
  const fetcher = useFetcher();
  return (
    <li
      className={cn(
        "flex items-center justify-between bg-muted rounded-md px-3 py-2",
        completed && "opacity-50 line-through"
      )}
    >
      <fetcher.Form method="put" className="inline">
        <div className="flex items-center">
          <Checkbox
            id={id.toString()}
            className="mr-2"
            name="completed"
            type="submit"
            checked={completed}
            onClick={(e) => {
              fetcher.submit(e.currentTarget.form);
            }}
          />
          <input
            type="hidden"
            name="todo"
            value={JSON.stringify({
              id,
              completed: !completed,
            })}
          />
          <label htmlFor={id.toString()} className="text-muted-foreground">
            {title}
          </label>
        </div>
      </fetcher.Form>
      <fetcher.Form method="delete" className="inline">
        <Button
          variant="ghost"
          type="submit"
          name="todoId"
          value={id}
          disabled={!!fetcher.formData}
          size="icon"
          className="text-muted-foreground h-7"
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </fetcher.Form>
    </li>
  );
}

export function AddTodo() {
  return (
    <div className="flex items-center mb-4">
      <Input
        type="text"
        placeholder="Add a new todo"
        className="flex-1 mr-2 bg-muted text-muted-foreground rounded-md px-3 py-2"
      />
      <Button>Add</Button>
    </div>
  );
}

export default function TodosPage() {
  const { todos } = useLoaderData() as TodoPageLoaderProps;
  return (
    <div className={cn(pageWrapperStyles, "space-y-4")}>
      <div className="h-screen bg-background w-full">
        <div className="m-auto w-full p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-card-foreground">
            Todo List
          </h1>
          <CreateTodoForm />
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} {...todo} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
