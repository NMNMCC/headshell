import { hc } from "hono/client";
import type { ServerType } from "@intzaaa/capi";

export const client = hc<ServerType>(process.env["BASE_URL"]!);
