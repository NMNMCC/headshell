import { DateObject, exec } from "./base";
import { ApiResponse, ErrorResponse } from "./base";
import { Maybe } from "@intzaaa/maybe";

export const routes_ids = {
    list: "routes/list",
    enable: "routes/enable",
    disable: "routes/disable",
    delete: "routes/delete",
} as const;

export type RouteObject = {
    id?: number;
    prefix?: string;
    advertised?: boolean;
    enabled?: boolean;
    node?: {
        id: number;
        name: string;
        ip_addresses: string[];
        machine_key: string;
    };
    created_at?: DateObject;
} & ErrorResponse;

export type routes_types = {
    list: Maybe<RouteObject[]>;
    enable: Maybe<RouteObject | ApiResponse>;
    disable: Maybe<RouteObject | ApiResponse>;
    delete: Maybe<ApiResponse>;
};

export const routes_handler = {
    list: () => exec<routes_types["list"]>(routes_ids.list, ["routes", "list"]),
    enable: (route_id: number) =>
        exec<routes_types["enable"]>(routes_ids.enable, ["routes", "enable", "-r", route_id.toString()]),
    disable: (route_id: number) =>
        exec<routes_types["disable"]>(routes_ids.disable, ["routes", "disable", "-r", route_id.toString()]),
    delete: (route_id: number) =>
        exec<routes_types["delete"]>(routes_ids.delete, ["routes", "delete", "-r", route_id.toString()]),
};
