import { ApiResponse, ErrorResponse, DateObject, exec } from "./base";
import { Maybe } from "@intzaaa/maybe";

export const users_ids = {
    list: "users/list",
    create: "users/create",
    destroy: "users/destroy",
    rename: "users/rename",
} as const;

export type UserObject = {
    id?: number;
    name?: string;
    created_at?: DateObject;
} & ErrorResponse;

export type users_types = {
    list: Maybe<UserObject[]>;
    create: Maybe<UserObject>;
    destroy: Maybe<ApiResponse>;
    rename: Maybe<UserObject | ApiResponse>;
};

export const users_handler = {
    list: () => exec<users_types["list"]>(users_ids.list, ["users", "list"]),
    create: (name: string) => exec<users_types["create"]>(users_ids.create, ["users", "create", name]),
    destroy: (name: string) => exec<users_types["destroy"]>(users_ids.destroy, ["users", "destroy", name]),
    rename: (old_name: string, new_name: string) =>
        exec<users_types["rename"]>(users_ids.rename, ["users", "rename", old_name, new_name]),
};
