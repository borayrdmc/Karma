import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../../lib/AuthConfig";

export const { GET, POST } = toNextJsHandler(auth.handler);