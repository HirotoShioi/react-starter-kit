"use server";
import { fetchAuthSession } from "aws-amplify/auth";
import { Todo, TodoSchema } from "./todo.model";

const BASE_PATH = import.meta.env.VITE_API_BASE_PATH;

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await fetchAuthSession();
  if (!session) {
    throw new Error("User is not authenticated");
  }
  const token = session.tokens?.idToken;
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token.toString()}`,
  };
  return fetch(url, { ...options, headers });
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetchWithAuth(`${BASE_PATH}/todos`);
  const res = await response.json();
  return TodoSchema.array().parse(res);
}

export async function getTodoById(id: number): Promise<Todo> {
  const response = await fetchWithAuth(`${BASE_PATH}/todos/${id}`);
  const res = await response.json();
  return TodoSchema.parse(res);
}

export async function createTodo(todo: { title: string }): Promise<Todo> {
  const response = await fetchWithAuth(`${BASE_PATH}/todos`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  const res = await response.json();
  const resTodo = TodoSchema.parse(res);
  return resTodo;
}

export async function updateTodo({
  id,
  title,
  completed,
}: {
  id: number;
  title?: string;
  completed?: boolean;
}): Promise<Todo> {
  const response = await fetchWithAuth(`${BASE_PATH}/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, completed }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  const resTodo = TodoSchema.parse(res);
  return resTodo;
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetchWithAuth(`${BASE_PATH}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}
