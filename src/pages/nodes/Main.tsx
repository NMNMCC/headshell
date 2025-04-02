import { AnyComponent } from "preact";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { get } from "../../stores/store";
import { nodes_handler, nodes_handler_helpers, nodes_ids, nodes_types } from "../../handlers/nodes";
import { useComputed, useSignal } from "@preact/signals";
import { trim } from "fp-ts/lib/string";
import { ActionComponent } from "../../components/common/ActionComponent";
import { DataTable } from "../../components/common/DataTable";
import { ListPageLayout } from "../../components/common/ListPageLayout";

export const Main: AnyComponent = () => {
    const maybe_rows = get<nodes_types["list"]>(nodes_ids.list);
    const search = useSignal("");
    const filtered_nodes = useComputed(() =>
        maybe_rows.value?.[1]?.filter((row) => JSON.stringify(row).includes(search.value)),
    );
    const checkboxes = useSignal<number[]>([]);
    const selected_nodes = useComputed(() =>
        filtered_nodes.value?.filter((row) => checkboxes.value.includes(row.id ?? 0)),
    );
    const selected_node_ids = useComputed(() => selected_nodes.value?.map((node) => node.id).join("") ?? "");

    useEffect(() => {
        entries.value = [
            {
                name: "Register",
                path: "/nodes/register",
            },
            {
                name: "Refresh",
                action: nodes_handler.list,
            },
        ];

        nodes_handler.list();
    }, []);

    const actions_area = (
        <>
            <ActionComponent
                name="Search"
                oninput={(e) => (search.value = e.currentTarget?.value)}
                placeholder="search for nodes"
            />
            <ActionComponent
                name="Delete"
                onsubmit={(e) => {
                    e.preventDefault();
                    if (
                        selected_nodes.value?.length &&
                        new FormData(e.currentTarget).get("input") === selected_node_ids.value
                    ) {
                        selected_nodes.value.map((node) => {
                            if (node.id !== undefined) {
                                nodes_handler.delete(node.id);
                            }
                        });
                    }
                }}
                placeholder={
                    selected_node_ids.value ? `type "${selected_node_ids.value}" to confirm` : "select nodes to delete"
                }
            />
            <ActionComponent
                name="+Tag"
                onsubmit={(e) => {
                    e.preventDefault();
                    const tag = (new FormData(e.currentTarget).get("input") as string).split(",").map(trim);
                    if (tag) {
                        selected_nodes.value?.map((node) => {
                            if (node.id !== undefined) {
                                nodes_handler_helpers.add_tag(node.id, ...tag);
                            }
                        });
                    }
                }}
                placeholder={
                    (selected_node_ids.value ? `add tag to ${selected_nodes.value?.length} nodes, ` : "") +
                    "tag1, tag2, tag3..."
                }
            />
            <ActionComponent
                name="-Tag"
                onsubmit={(e) => {
                    e.preventDefault();
                    const tag = (new FormData(e.currentTarget).get("input") as string).split(",").map(trim);
                    if (tag) {
                        selected_nodes.value?.map((node) => {
                            if (node.id !== undefined) {
                                nodes_handler_helpers.remove_tag(node.id, ...tag);
                            }
                        });
                    }
                }}
                placeholder={
                    (selected_node_ids.value ? `remove tag from ${selected_nodes.value?.length} nodes, ` : "") +
                    "tag1, tag2, tag3..."
                }
            />
        </>
    );

    const data_table = filtered_nodes.value ? (
        <DataTable
            data={filtered_nodes.value}
            columns={[
                { header: "ID", key: "id" },
                { header: "Name", key: "name" },
                { header: "User", render: (node) => <>{node.user?.name}</> },
                {
                    header: "IPs",
                    render: (node) => (
                        <>
                            {node.ip_addresses?.map((ip) => (
                                <>
                                    {ip}
                                    <br />
                                </>
                            ))}
                        </>
                    ),
                },
                { header: "Online", render: (node) => <>{node.online ? "Yes" : "No"}</> },
                {
                    header: "Last Seen",
                    render: (node) => (
                        <>{node.last_seen?.seconds ? new Date(node.last_seen?.seconds * 1000).toLocaleString() : "-"}</>
                    ),
                },
                {
                    header: "Tags",
                    render: (node) => <>{node.valid_tags?.map((tag) => tag.replace("tag:", "")).join(", ")}</>,
                },
            ]}
            checkboxes={checkboxes}
            id_key="id"
            name_key="name"
            detail_path_prefix="/nodes"
        />
    ) : null;

    return (
        <ListPageLayout
            title="Nodes"
            error={maybe_rows.value?.[0]?.toString()}
            actions_area={actions_area}
            data_table={data_table}
        />
    );
};
