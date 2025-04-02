import { AnyComponent } from "preact";
import { useRoute } from "preact-iso";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { NodeObject, nodes_handler, nodes_handler_helpers } from "../../handlers/nodes";
import { ActionComponent } from "../../components/common/ActionComponent";
import { DetailTable } from "../../components/common/DetailTable";
import { DetailPageLayout } from "../../components/common/DetailPageLayout";

export const Detail: AnyComponent = () => {
    const id = useRoute().params["id"]!;
    const node = nodes_handler_helpers.get_node(parseInt(id))!;

    const { user, ...others } = node as Required<NodeObject>;

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

    const actions_area = (
        <>
            <ActionComponent
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
            <ActionComponent
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
            <ActionComponent
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
            <ActionComponent
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
            <ActionComponent
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
    );

    const details_area = <DetailTable data={others} />;
    const subtitle = node.valid_tags?.map((tag) => tag.replace("tag:", "")).join(" ");
    return (
        <DetailPageLayout
            title={node.name || ""}
            subtitle={subtitle || ""}
            error={!node ? "Node not found" : ""}
            actions_area={actions_area}
            details_area={details_area}
        />
    );
};
