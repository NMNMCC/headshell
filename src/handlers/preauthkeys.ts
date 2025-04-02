import { ApiResponse, DateObject, ErrorResponse, exec } from "./base";
import { Maybe } from "@intzaaa/maybe";

export const preauthkeys_ids = {
    list: "preauthkeys/list",
    create: "preauthkeys/create",
    expire: "preauthkeys/expire",
} as const;

export type PreAuthKeyObject = {
    user?: string;
    id?: string;
    key?: string;
    used?: boolean;
    expiration?: DateObject;
    created_at?: DateObject;
} & ErrorResponse;

export type preauthkeys_types = {
    list: Maybe<PreAuthKeyObject[]>;
    create: Maybe<PreAuthKeyObject>;
    expire: Maybe<ApiResponse>;
};

export const preauthkeys_handler = {
    list: (user: string) => exec<preauthkeys_types["list"]>(preauthkeys_ids.list, ["preauthkeys", "list", "-u", user]),
    create: (user: string, reusable: boolean = false, ephemeral: boolean = false, expiration?: string) =>
        exec<preauthkeys_types["create"]>(
            preauthkeys_ids.create,
            [
                "preauthkeys",
                "create",
                "-u",
                user,
                reusable ? "--reusable" : undefined,
                ephemeral ? "--ephemeral" : undefined,
                expiration ? "-e" : undefined,
                expiration,
            ].filter(Boolean) as [string, ...string[]],
        ),
    expire: (key: string, user: string) =>
        exec<preauthkeys_types["expire"]>(preauthkeys_ids.expire, ["preauthkeys", "expire", key, "-u", user]),
};
