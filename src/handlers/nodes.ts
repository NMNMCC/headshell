import { get } from "../stores/store";
import { ApiResponse, ErrorResponse, DateObject, exec } from "./base";
import { fail, Maybe } from "@intzaaa/maybe";

export const nodes_ids = {
    list: "nodes/list",
    delete: "nodes/delete",
    expire: "nodes/expire",
    register: "nodes/register",
    rename: "nodes/rename",
    tag: "nodes/tag",
    move: "nodes/move",
    backfillips: "nodes/backfillips",
} as const;

export type RegisterResponse = ApiResponse & {
    key?: string;
    node_id?: number;
};

export type TagResponse = ApiResponse & {
    tags?: string[];
};

export type NodeObject = {
    id?: number;
    machine_key?: string;
    node_key?: string;
    disco_key?: string;
    ip_addresses?: string[];
    name?: string;
    user?: {
        id: number;
        name: string;
        created_at: DateObject;
    };
    last_seen?: DateObject;
    expiry?: DateObject;
    pre_auth_key?: {
        user: string;
        id: string;
        key: string;
        used: boolean;
        expiration: DateObject;
        created_at: DateObject;
    };
    created_at?: DateObject;
    register_method?: number;
    given_name?: string;
    online?: boolean;
    forced_tags?: string[];
    valid_tags?: string[];
} & ErrorResponse;

export type nodes_types = {
    list: Maybe<NodeObject[]>;
    delete: Maybe<NodeObject | ApiResponse>;
    expire: Maybe<NodeObject | ApiResponse>;
    register: Maybe<NodeObject | RegisterResponse>;
    rename: Maybe<NodeObject | ApiResponse>;
    tag: Maybe<NodeObject | TagResponse>;
    move: Maybe<NodeObject | ApiResponse>;
    backfillips: Maybe<ApiResponse>;
};

export const nodes_handler = {
    list: () => exec<nodes_types["list"]>(nodes_ids.list, ["nodes", "list"]),
    delete: (identifier: number) =>
        exec<nodes_types["delete"]>(nodes_ids.delete, ["nodes", "delete", "-i", identifier.toString(), "--force"]),
    expire: (identifier: number) =>
        exec<nodes_types["expire"]>(nodes_ids.expire, ["nodes", "expire", "-i", identifier.toString()]),
    register: (key: string, user: string) =>
        exec<nodes_types["register"]>(nodes_ids.register, ["nodes", "register", "-k", key, "-u", user]),
    rename: (new_name: string, identifier: number) =>
        exec<nodes_types["rename"]>(nodes_ids.rename, ["nodes", "rename", new_name, "-i", identifier.toString()]),
    tag: (identifier: number, tags: string[]) =>
        exec<nodes_types["tag"]>(nodes_ids.tag, [
            "nodes",
            "tag",
            "-i",
            identifier.toString(),
            ...tags.flatMap((tag) => ["-t", "tag:" + tag]),
        ]),
    move: (identifier: number, user: string) =>
        exec<nodes_types["move"]>(nodes_ids.move, ["nodes", "move", "-i", identifier.toString(), "-u", user]),
    backfillips: () => exec<nodes_types["backfillips"]>(nodes_ids.backfillips, ["nodes", "backfillips"]),
};

export const nodes_handler_helpers = {
    get_node: (identifier: number) => {
        const [err, nodes] = get<nodes_types["list"]>(nodes_ids.list)?.value ?? [fail("No nodes found")];
        if (err) return;

        return nodes?.find((node) => node?.id === identifier);
    },
    add_tag: async (identifier: number, ...tags: string[]) => {
        const [err, nodes] = get<nodes_types["list"]>(nodes_ids.list)?.value ?? [fail("No nodes found")];
        if (err) return;

        const node = nodes?.find((node) => node?.id === identifier);
        if (!node) return;

        const current_tags = (node.valid_tags ?? []).map((tag) => tag.replace("tag:", "")).filter(Boolean);
        const new_tags = [...current_tags, ...tags];

        return nodes_handler.tag(identifier, new_tags);
    },
    remove_tag: async (identifier: number, ...tags: string[]) => {
        const [err, nodes] = get<nodes_types["list"]>(nodes_ids.list)?.value ?? [fail("No nodes found")];
        if (err) return fail(err);

        const node = nodes?.find((node) => node?.id === identifier);
        if (!node) return fail("Node not found");

        const current_tags = (node.valid_tags ?? []).map((tag) => tag.replace("tag:", "")).filter(Boolean);
        const new_tags = current_tags.filter((tag) => !tags.includes(tag));

        return nodes_handler.tag(identifier, new_tags);
    },
};
