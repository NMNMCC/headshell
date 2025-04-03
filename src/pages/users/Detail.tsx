import { AnyComponent, ComponentChild } from "preact";
import { useRoute } from "preact-iso";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { users_handler, users_ids, users_types } from "../../handlers/users";
import { useComputed } from "@preact/signals";
import { get } from "../../stores/store";
import { ActionText } from "../../components/utils/ActionText";
import { DetailTable } from "../../components/tables/DetailTable";
import { DetailPageLayout } from "../../components/layouts/DetailLayout";
import { nodes_ids, nodes_types } from "../../handlers/nodes";
import { ActionButton } from "../../components/utils/ActionButton";

export const Detail: AnyComponent = () => {
    const id = useRoute().params["id"]!;
    const maybe_users = get<users_types["list"]>(users_ids.list);
    const user = useComputed(() => maybe_users.value?.[1]?.find((u) => u.id === parseInt(id)));
    const nodes = useComputed(() =>
        get<nodes_types["list"]>(nodes_ids.list).value?.[1]?.filter((n) => n.user?.id === user.value?.id),
    );

    useEffect(() => {
        entries.value = [
            {
                name: "Back",
                path: "/users",
            },
            {
                name: "Refresh",
                action: users_handler.list,
            },
        ];

        if (!maybe_users.value) {
            users_handler.list();
        }
    }, []);

    return (
        <DetailPageLayout
            title={user.value?.name ?? ""}
            actions={
                <>
                    <ActionText
                        name="Rename"
                        onsubmit={async (e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const new_name = form_data.get("input") as string;

                            if (new_name?.trim() && user.value?.name) {
                                await users_handler.rename(user.value.name, new_name.trim());
                            }
                        }}
                        placeholder="new name"
                    />
                    <ActionText
                        name="Delete"
                        onsubmit={(e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const input = form_data.get("input") as string;

                            if (input === `${user.value?.name}` && user.value?.name) {
                                if (user.value.id !== undefined) {
                                    users_handler.destroy(user.value.id);
                                }
                            }
                        }}
                        placeholder={`type "${user.value?.name}" to confirm`}
                    />
                </>
            }
            table={
                <DetailTable
                    rows={[
                        ...Object.entries(user.value ?? {}).map(([k, v]): [string, ComponentChild] => {
                            if (typeof v === "object") {
                                if ("seconds" in v) {
                                    return [k, new Date(v.seconds * 1000).toLocaleString()];
                                } else {
                                    return [k, JSON.stringify(v)];
                                }
                            }

                            return [k, v];
                        }),
                        [
                            "Nodes",
                            nodes.value?.map((node) => {
                                return (
                                    <>
                                        <ActionButton name={node.given_name ?? ""} path={`/nodes/${node.id}`} />
                                        <br />
                                    </>
                                );
                            }),
                        ],
                    ]}
                />
            }
        />
    );
};
