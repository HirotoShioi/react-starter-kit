import { createMiddleware } from "hono/factory";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { ApplicationContext } from "../context";

const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  region: process.env.REGION!,
  tokenUse: "id",
  clientId: process.env.CLIENT_ID!,
});

export const authMiddleWare = createMiddleware<ApplicationContext>(async (c, next) => {
  const header = c.req.raw.headers.get("Authorization");
  if (!header) {
    return c.json({ error: "Authorization header is required" }, 401);
  }
  const token = header.split(" ")[1];
  if (!token) {
    return c.json({ error: "Authorization header is required" }, 401);
  }
  try {
    const verified = await cognitoJwtVerifier.verify(token)
    c.set('jwtPayload', verified);
    await next();
  } catch (e) {
    console.log(e)
    return c.json({ error: "Invalid token" }, 401);
  }
});
