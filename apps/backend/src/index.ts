import { Hono } from "hono";
import { cors } from 'hono/cors'
import { ApplicationContext } from "./context";
import { logger } from "hono/logger";
import todos from "./routes/todos";
import chat from "./routes/chat";
import nft from "./routes/nft";
const app = new Hono<ApplicationContext>().basePath("/api");
app.use(logger());
app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/todos", todos);
app.route("/chat", chat)
app.route("/nft", nft)
export default {
  port: 8080,
  fetch: app.fetch,
};
