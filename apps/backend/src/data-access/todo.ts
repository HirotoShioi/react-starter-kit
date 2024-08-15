import * as schema from "../db/schema";
import { db } from "../db/db";
import { eq, and } from "drizzle-orm";
import { Todo } from "../model/Todo";

function toTodoModel(todo: {
  id: number;
  userId: string;
  title: string;
  completed: number;
}): Todo {
  return {
    id: todo.id,
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed === 1 ? true : false,
  };
}
export async function getTodos(userId: string) {
  const todos = await db.query.todos.findMany({
    where: eq(schema.todos.userId, userId),
  });
  return todos.map(toTodoModel);
}

export async function getTodoById(userId: string, id: number) {
  const todo = await db.query.todos.findFirst({
    where: and(eq(schema.todos.userId, userId), eq(schema.todos.id, id)),
  });
  return todo ? toTodoModel(todo) : null;
}

export async function createTodo(userId: string, title: string) {
  const [todo] = await db
    .insert(schema.todos)
    .values({
      userId,
      title,
      completed: 0,
    })
    .returning();
  return toTodoModel(todo);
}

export async function updateTodo(userId: string, id: number, title?: string, completed?: boolean) {
  const [todo] = await db
    .update(schema.todos)
    .set({
      title,
      completed: completed ? 1 : 0,
    })
    .where(and(eq(schema.todos.userId, userId), eq(schema.todos.id, id)))
    .returning();
  return todo ? toTodoModel(todo) : null;
}

export async function deleteTodo(userId: string, id: number) {
  await db.delete(schema.todos).where(and(eq(schema.todos.userId, userId), eq(schema.todos.id, id)));
}