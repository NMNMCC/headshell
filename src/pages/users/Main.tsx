import { AnyComponent } from "preact";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { get } from "../../stores/store";
import { users_handler, users_ids, users_types } from "../../handlers/users";
import { useComputed, useSignal } from "@preact/signals";
import { ActionText } from "../../components/utils/ActionText";
import { DataTable } from "../../components/tables/DataTable";
import { MainLayout } from "../../components/layouts/MainLayout";
import { ShowError } from "../../components/utils/Error";
import { ActionButton } from "../../components/utils/ActionButton";

export const Main: AnyComponent = () => {
    const maybe_rows = get<users_types["list"]>(users_ids.list);
    const search = useSignal("");
    const filtered_users = useComputed(() =>
        maybe_rows.value?.[1]?.filter((row) => JSON.stringify(row).includes(search.value)),
    );
    const checkboxes = useSignal<number[]>([]);
    const selected_users = useComputed(() =>
        filtered_users.value?.filter((row) => checkboxes.value.includes(row.id ?? 0)),
    );
    const selected_user_ids = useComputed(() => selected_users.value?.map((user) => user.id).join("") ?? "");

    useEffect(() => {
        entries.value = [
            {
                name: "Create",
                path: "/users/create",
            },
            {
                name: "Refresh",
                action: users_handler.list,
            },
        ];

        users_handler.list();
    }, []);

    return !filtered_users.value ? (
        <ShowError error={maybe_rows.value?.[0]}></ShowError>
    ) : (
        <MainLayout
            title="Users"
            actions={
                <>
                    <ActionText
                        name="Search"
                        oninput={(e) => (search.value = e.currentTarget?.value)}
                        placeholder="search for users"
                    />
                    <ActionText
                        name="Delete"
                        onsubmit={(e) => {
                            e.preventDefault();
                            if (
                                selected_users.value?.length &&
                                new FormData(e.currentTarget).get("input") === selected_user_ids.value
                            ) {
                                selected_users.value.map((user) => {
                                    if (user.id !== undefined) {
                                        users_handler.destroy(user.id);
                                    }
                                });
                            }
                        }}
                        placeholder={
                            selected_user_ids.value
                                ? `type "${selected_user_ids.value}" to confirm`
                                : "select users to delete"
                        }
                    />
                </>
            }
            table={
                <DataTable
                    headers={["ID", "Name", "Created At"]}
                    rows={filtered_users.value?.map((user) => [
                        String(user.id),
                        [
                            String(user.id),
                            <ActionButton name={user.name ?? ""} path={`/users/${user.id}`} />,
                            user.created_at?.seconds ? new Date(user.created_at?.seconds * 1000).toLocaleString() : "-",
                        ],
                    ])}
                    selected_rows={checkboxes}
                />
            }
        />
    );
};
