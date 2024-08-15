import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../data-access/todo";
import { Hono } from "hono";
import { ApplicationContext } from "../context";
import { authMiddleWare } from "../middlewares/auth";

const app = new Hono<ApplicationContext>();
app.use("/*", authMiddleWare);
const createTodoSchema = z.object({
  title: z.string().min(1).max(100),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  completed: z.boolean().optional(),
});

const getTodoSchema = z.object({
  id: z.coerce.number().int().positive(),
});

app.post("/", zValidator("json", createTodoSchema), async (c) => {
  const { title } = c.req.valid("json");
  const todo = await createTodo(c.get("jwtPayload").sub, title);
  return c.json(todo);
});

app.get("/:id", zValidator("param", getTodoSchema), async (c) => {
  const { id } = c.req.valid("param");
  const todo = await getTodoById(c.get("jwtPayload").sub, id);
  return c.json(todo);
});

app.get("/", async (c) => {
  const todos = await getTodos(c.get("jwtPayload").sub);
  return c.json(todos);
});

app.put(
  "/:id",
  zValidator("param", getTodoSchema),
  zValidator("json", updateTodoSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { title, completed } = c.req.valid("json");
    const todo = await updateTodo(
      c.get("jwtPayload").sub,
      id,
      title,
      completed
    );
    return c.json(todo);
  }
);

app.delete("/:id", zValidator("param", getTodoSchema), async (c) => {
  const { id } = c.req.valid("param");
  await deleteTodo(c.get("jwtPayload").sub, id);
  return c.json({ success: true });
});

export default app;
