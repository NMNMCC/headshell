import { exec } from "./base";
import { ApiResponse, ErrorResponse } from "./base";
import { Maybe } from "@intzaaa/maybe";

export const policy_ids = {
    get: "policy/get",
    set: "policy/set",
} as const;

export type PolicyObject = {
    rules?: any[];
    groups?: Record<string, string[]>;
    hosts?: Record<string, string[]>;
    acls?: any[];
    tests?: any[];
    autogroups?: any[];
    ssh_users?: string[];
} & ErrorResponse;

export type policy_types = {
    get: Maybe<PolicyObject>;
    set: Maybe<ApiResponse>;
};

export const policy_handler = {
    get: () => exec<policy_types["get"]>(policy_ids.get, ["policy", "get"]),
    set: (policy_file: string) => exec<policy_types["set"]>(policy_ids.set, ["policy", "set", "-f", policy_file]),
};
