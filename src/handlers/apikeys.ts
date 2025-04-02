import { ApiResponse, DateObject, ErrorResponse, exec } from "./base";
import { Maybe } from "@intzaaa/maybe";

export const apikeys_ids = {
    list: "apikeys/list",
    create: "apikeys/create",
    delete: "apikeys/delete",
    expire: "apikeys/expire",
} as const;

export type ApiKeyObject = {
    id?: number;
    prefix?: string;
    expiration?: DateObject;
    created_at?: DateObject;
} & ErrorResponse;

export type CreateApiKeyResponse = ApiResponse & {
    key?: string;
    prefix?: string;
    expiration?: DateObject;
};

export type apikeys_types = {
    list: Maybe<ApiKeyObject[]>;
    create: Maybe<CreateApiKeyResponse>;
    delete: Maybe<ApiResponse>;
    expire: Maybe<ApiResponse>;
};

export const apikeys_handler = {
    list: () => exec<apikeys_types["list"]>(apikeys_ids.list, ["apikeys", "list"]),
    create: (expiration?: string) =>
        exec<apikeys_types["create"]>(
            apikeys_ids.create,
            ["apikeys", "create", expiration ? "-e" : undefined, expiration].filter(Boolean) as [string, ...string[]],
        ),
    delete: (prefix: string) => exec<apikeys_types["delete"]>(apikeys_ids.delete, ["apikeys", "delete", "-p", prefix]),
    expire: (prefix: string) => exec<apikeys_types["expire"]>(apikeys_ids.expire, ["apikeys", "expire", "-p", prefix]),
};
