import { hc } from "hono/client";
import { ServerType } from "@intzaaa/capi";
import { Signal } from "@preact/signals";
import { fail, Maybe, succeed } from "@intzaaa/maybe";
import { get_auth, set } from "../stores/store";

export type ErrorResponse = {
    error?: string;
};

export type SuccessResponse = {
    success?: boolean;
    message?: string;
};

export type DateObject = {
    seconds: number;
    nanos: number;
};

export type ApiResponse = ErrorResponse & SuccessResponse;

const client = hc<ServerType>(process.env["BASE_URL"]!);

export const test = async () => {
    const auth = get_auth().value;
    if (!auth) return false;

    const res = await client.health.$get(
        {},
        {
            headers: {
                Authorization: `${auth.username}:${auth.password}`,
            },
        },
    );

    if (res.ok) return true;
    return false;
};

export const exec = async <R extends object>(
    id: `${string}/${string}`,
    args: [string, ...(string | undefined)[]],
    transformer: (data: any) => Promise<R> | R = JSON.parse.bind(JSON),
): Promise<Signal<Maybe<R>>> => {
    try {
        const auth = get_auth().value;
        if (!auth) return set(id, fail("Token does not exist"));

        const args_string = [...args, "-o", "json-line"]
            .filter((arg) => arg !== undefined)
            .map(encodeURIComponent)
            .join("/");

        const res = await client.exec[":exec"][":args{.+}"].$get(
            { param: { exec: "headscale", args: args_string } },
            { headers: { Authorization: `${auth.username}:${auth.password}` } },
        );

        const text = await res.text();

        if (!res.ok) return set(id, fail(`Execution ${id} failed: ${text}`));

        return set(id, succeed(await transformer(text)));
    } catch (err) {
        return set(id, fail(err));
    }
};
