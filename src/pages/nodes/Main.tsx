import { AnyComponent } from "preact";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { get } from "../../stores/store";
import { nodes_handler, nodes_handler_helpers, nodes_ids, nodes_types } from "../../handlers/nodes";
import { useComputed, useSignal } from "@preact/signals";
import { trim } from "fp-ts/lib/string";
import { ActionText } from "../../components/utils/ActionText";
import { DataTable } from "../../components/tables/DataTable";
import { MainLayout } from "../../components/layouts/MainLayout";
import { ActionButton } from "../../components/utils/ActionButton";
import { ShowError } from "../../components/utils/Error";
import { ToUser } from "../../components/users/ToUser";

export const Main: AnyComponent = () => {
    const maybe_nodes = get<nodes_types["list"]>(nodes_ids.list);
    const search = useSignal("");
    const filtered_nodes = useComputed(() =>
        maybe_nodes.value?.[1]?.filter((row) => JSON.stringify(row).includes(search.value)),
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

    return !filtered_nodes.value ? (
        <ShowError error={maybe_nodes.value?.[0]}></ShowError>
    ) : (
        <MainLayout
            title="Nodes"
            actions={
                <>
                    <ActionText
                        name="Search"
                        oninput={(e) => (search.value = e.currentTarget?.value)}
                        placeholder="search for nodes"
                    />
                    <ActionText
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
                            selected_node_ids.value
                                ? `type "${selected_node_ids.value}" to confirm`
                                : "select nodes to delete"
                        }
                    />
                    <ActionText
                        name="+Tag"
                        onsubmit={(e) => {
                            e.preventDefault();
                            const tag = (new FormData(e.currentTarget).get("input") as string).split(",").map(trim);
                            if (tag) {
                                selected_nodes.value?.map((node) => {
                                    node.id && nodes_handler_helpers.add_tag(node.id, ...tag);
                                });
                            }
                        }}
                        placeholder={
                            (selected_node_ids.value ? `add tag to ${selected_nodes.value?.length} nodes, ` : "") +
                            "tag1, tag2, tag3..."
                        }
                    />
                    <ActionText
                        name="-Tag"
                        onsubmit={(e) => {
                            e.preventDefault();
                            const tag = (new FormData(e.currentTarget).get("input") as string).split(",").map(trim);
                            if (tag) {
                                selected_nodes.value?.map((node) => {
                                    node.id && nodes_handler_helpers.remove_tag(node.id, ...tag);
                                });
                            }
                        }}
                        placeholder={
                            (selected_node_ids.value ? `remove tag from ${selected_nodes.value?.length} nodes, ` : "") +
                            "tag1, tag2, tag3..."
                        }
                    />
                </>
            }
            table={
                <DataTable
                    headers={["ID", "Name", "User", "IPs", "Online", "Last Seen", "Tags"]}
                    rows={filtered_nodes.value.map((node) => [
                        String(node.id),
                        [
                            String(node.id),
                            <ActionButton name={node.given_name ?? ""} path={`/nodes/${node.id}`} />,
                            <>
                                <ToUser name={node.user?.name ?? ""} id={node.user?.id ?? NaN} />
                            </>,
                            <>
                                {node.ip_addresses?.map((ip) => (
                                    <>
                                        {ip}
                                        <br />
                                    </>
                                ))}
                            </>,
                            <>{node.online ? "Yes" : "No"}</>,
                            <>
                                {node.last_seen?.seconds
                                    ? new Date(node.last_seen?.seconds * 1000).toLocaleString()
                                    : "-"}
                            </>,
                            <>{node.valid_tags?.map((tag) => tag.replace("tag:", "")).join(", ")}</>,
                        ],
                    ])}
                    selected_rows={checkboxes}
                />
            }
        />
    );
};
