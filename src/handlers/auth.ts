import { fail, Maybe } from "@intzaaa/maybe";
import { client } from "./client";
import { set } from "../stores/store";

export const auth = async (code: string): Promise<Maybe<string>> => {
    const res = await client.auth[":code?"].$get({ param: { code } });

    const text = await res.text();

    if (res.ok) return set("token", text);

    return fail(text);
};
