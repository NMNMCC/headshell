import { Maybe, succeed } from "@intzaaa/maybe";
import { get } from "../../stores/token";
import { parseTable } from "../../utils/parse-table";
import { client } from "../client";

export type NodesListItem = {
    ID: string;
    Hostname: string;
    Name: string;
    MachineKey: string;
    NodeKey: string;
    User: string;
    "IP addresses": string;
    Ephemeral: string;
    "Last seen": string;
    Expiration: string;
    Connected: "offline" | "online";
    Expired: string;
};

export const list = async (): Promise<Maybe<NodesListItem[]>> => {
    const [err, token] = get();
    if (err) return err as any;

    const res = await client.exec[":exec"][":args{.+}"].$get(
        {
            param: {
                exec: "headscale",
                args: "nodes/list",
            },
        },
        {
            headers: {
                Authorization: token,
            },
        }
    );

    return succeed(parseTable(await res.text()) as any);
};
