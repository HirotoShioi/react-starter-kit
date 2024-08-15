import {
  getTodos as getTodosFromDataAccess,
  getTodoById as getTodoByIdFromDataAccess,
  createTodo as createTodoInDataAccess,
  updateTodo as updateTodoInDataAccess,
  deleteTodo as deleteTodoInDataAccess,
} from "@/data-access/todos";

export async function getTodos() {
  return getTodosFromDataAccess();
}

export async function getTodoById(id: number) {
  return getTodoByIdFromDataAccess(id);
}

export async function createTodo(todo: { title: string }) {
  return createTodoInDataAccess(todo);
}

export async function updateTodo({
  id,
  title,
  completed,
}: {
  id: number;
  title?: string;
  completed?: boolean;
}) {
  return updateTodoInDataAccess({ id, title, completed });
}

export async function deleteTodo(id: number) {
  return deleteTodoInDataAccess(id);
}
