import { AnyComponent } from "preact";
import { useRoute } from "preact-iso";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { users_handler } from "../../handlers/users";
import { useComputed } from "@preact/signals";
import { get } from "../../stores/store";
import { ActionComponent } from "../../components/common/ActionComponent";
import { DetailTable } from "../../components/common/DetailTable";
import { DetailPageLayout } from "../../components/common/DetailPageLayout";

export const Detail: AnyComponent = () => {
    const id = useRoute().params["id"]!;
    const maybe_users = get("users/list");
    const user = useComputed(() => maybe_users.value?.[1]?.find((u) => u.id === parseInt(id)));

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

    const actions_area = (
        <>
            <ActionComponent
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
            <ActionComponent
                name="Delete"
                onsubmit={(e) => {
                    e.preventDefault();
                    const form_data = new FormData(e.currentTarget);
                    const input = form_data.get("input") as string;

                    if (input === `${user.value?.name}` && user.value?.name) {
                        users_handler.destroy(user.value.name);
                    }
                }}
                placeholder={`type "${user.value?.name}" to confirm`}
            />
        </>
    );

    const details_area = user.value ? <DetailTable data={user.value} excluded_keys={["error"]} /> : null;

    return (
        <DetailPageLayout
            title={user.value?.name || ""}
            error={!user.value ? "User not found" : undefined}
            actions_area={actions_area}
            details_area={details_area}
        />
    );
};
