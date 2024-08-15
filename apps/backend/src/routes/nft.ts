import { Hono } from "hono";
import { ApplicationContext } from "../context";
import { authMiddleWare } from "../middlewares/auth";

import "../lib/shim";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
const app = new Hono<ApplicationContext>();

app.use("/*", authMiddleWare);

const messageSchema = z.string();

const nftSchema = z.object({
  name: z.string().min(1).describe("Name of the NFT. Japanese is supported."),
  symbol: z.string().min(1).max(10).describe("Symbol of the NFT."),
  description: z
    .string()
    .min(1)
    .max(50)
    .describe("Description of the NFT. Markdown is supported."),
  external_url: z
    .string()
    .url()
    .optional()
    .describe("URL of the official page of the event"),
  image: z.string().url().optional().describe("URL of the image of the NFT"),
  startsAt: z.date().optional().describe("Date when the event starts."),
  endsAt: z.date().optional().describe("Date when the event ends"),
  attributes: z
    .array(
      z.object({
        key: z.string().min(1).max(5).describe("Key of the attribute"),
        value: z.string().min(1).max(5).describe("Value of the attribute"),
      })
    )
    .max(3)
    .optional()
    .describe("Attributes of the NFT"),
  // howToAcquire: z
  //   .string()
  //   .optional()
  //   .describe("Description of how to acquire the NFT"),
  isCoupon: z.boolean().describe("True if the NFT is used as a coupon."),
});

app.post("/", zValidator("json", messageSchema), async (c) => {
  const context = c.req.valid("json");
  const result = await streamObject({
    model: openai("gpt-4o-mini-2024-07-18"),
    schema: nftSchema,
    system: "You are an expert in marketing and you are tasked with creating an NFT for an event.",
    prompt: `Generate NFT metadata with following context: ${context}
    Do not make stuff up for the "external_url", "howToAcquire", "image", "startsAt", "endsAt" fields.
    If they are not provided, they should not be included in the output.
    Provided dates are in JST.
    For "startsAt" and "endsAt", look for the date in the context and use it as the date when the event starts and ends.
    "external_ur"l is a URL of the official page.
    "symbol" should be something meaningful, try not to use abbreviations.`
  });
  return result.toTextStreamResponse();
});

export default app;
