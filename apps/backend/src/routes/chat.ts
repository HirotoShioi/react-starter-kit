import { Hono } from "hono";
import { ApplicationContext } from "../context";
import { authMiddleWare } from "../middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import "../lib/shim"
const app = new Hono<ApplicationContext>();

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});


app.use("/*", authMiddleWare);

app.post("/", zValidator("json", messageSchema), async (c) => {
  const { messages } = c.req.valid("json");
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: "You are a helpful assistant.",
    messages: convertToCoreMessages(messages),
  })
  return result.toAIStreamResponse()
});

export default app;