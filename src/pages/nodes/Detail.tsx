import { AnyComponent, ComponentChild } from "preact";
import { useRoute } from "preact-iso";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { nodes_handler, nodes_handler_helpers } from "../../handlers/nodes";
import { ActionText } from "../../components/utils/ActionText";
import { DetailTable } from "../../components/tables/DetailTable";
import { DetailPageLayout } from "../../components/layouts/DetailLayout";
import { ShowError } from "../../components/utils/Error";
import { ToUser } from "../../components/users/ToUser";

export const Detail: AnyComponent = () => {
    const id = useRoute().params["id"]!;
    const node = nodes_handler_helpers.get_node(parseInt(id))!;

    const { user, ...others } = node;

    useEffect(() => {
        entries.value = [
            {
                name: "Back",
                path: "/nodes",
            },
            {
                name: "Refresh",
                action: nodes_handler.list,
            },
        ];
    }, []);

    return !node ? (
        <ShowError error={"Node not found"}></ShowError>
    ) : (
        <DetailPageLayout
            title={node.given_name ?? ""}
            actions={
                <>
                    <ActionText
                        name="Rename"
                        onsubmit={async (e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const new_name = form_data.get("input") as string;

                            if (new_name?.trim() && node.id) {
                                await nodes_handler.rename(new_name.trim(), node.id);
                            }
                        }}
                        placeholder="new name"
                    />
                    <ActionText
                        name="Expire"
                        onsubmit={async (e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const input = form_data.get("input") as string;

                            if (input === `${node.given_name}` && node.id) {
                                await nodes_handler.expire(node.id);
                            }
                        }}
                        placeholder={`type "${node.given_name}" to confirm`}
                    />
                    <ActionText
                        name="Delete"
                        onsubmit={(e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const input = form_data.get("input") as string;

                            if (input === `${node.given_name}` && node.id) {
                                // Function to delete the node would go here
                            }
                        }}
                        placeholder={`type "${node.given_name}" to confirm`}
                    />
                    <ActionText
                        name="+Tag"
                        onsubmit={async (e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const tags = (form_data.get("input") as string)
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean);

                            if (tags.length > 0 && node.id) {
                                await nodes_handler_helpers.add_tag(node.id, ...tags);
                            }
                        }}
                        placeholder="tag1, tag2, tag3..."
                    />
                    <ActionText
                        name="-Tag"
                        onsubmit={async (e) => {
                            e.preventDefault();
                            const form_data = new FormData(e.currentTarget);
                            const tags = (form_data.get("input") as string)
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean);

                            if (tags.length > 0 && node.id) {
                                await nodes_handler_helpers.remove_tag(node.id, ...tags);
                            }
                        }}
                        placeholder="tag1, tag2, tag3..."
                    />
                </>
            }
            table={
                <DetailTable
                    rows={[
                        ["user", <ToUser name={user?.name ?? ""} id={user?.id ?? NaN} />],
                        ...Object.entries(others).map(([k, v]): [string, ComponentChild] => {
                            if (typeof v === "object") {
                                if ("seconds" in v) {
                                    return [k, new Date(v.seconds * 1000).toLocaleString()];
                                } else if (Array.isArray(v)) {
                                    return [
                                        k,
                                        v.map((t) => (
                                            <>
                                                {t}
                                                <br />
                                            </>
                                        )),
                                    ];
                                } else {
                                    return [k, JSON.stringify(v)];
                                }
                            }

                            return [k, v];
                        }),
                    ]}
                />
            }
        ></DetailPageLayout>
    );
};
