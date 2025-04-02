import { AnyComponent } from "preact";
import { useEffect } from "preact/hooks";
import { entries } from "../../components/base/Header";
import { get } from "../../stores/store";
import { users_handler, users_ids, users_types } from "../../handlers/users";
import { useComputed, useSignal } from "@preact/signals";
import { ActionComponent } from "../../components/common/ActionComponent";
import { DataTable } from "../../components/common/DataTable";
import { ListPageLayout } from "../../components/common/ListPageLayout";

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

    const actions_area = (
        <>
            <ActionComponent
                name="Search"
                oninput={(e) => (search.value = e.currentTarget?.value)}
                placeholder="search for users"
            />
            <ActionComponent
                name="Delete"
                onsubmit={(e) => {
                    e.preventDefault();
                    if (
                        selected_users.value?.length &&
                        new FormData(e.currentTarget).get("input") === selected_user_ids.value
                    ) {
                        selected_users.value.map((user) => {
                            if (user.name !== undefined) {
                                users_handler.destroy(user.name);
                            }
                        });
                    }
                }}
                placeholder={
                    selected_user_ids.value ? `type "${selected_user_ids.value}" to confirm` : "select users to delete"
                }
            />
        </>
    );

    const columns = [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        {
            header: "Created At",
            render: (user) => (
                <>{user.created_at?.seconds ? new Date(user.created_at?.seconds * 1000).toLocaleString() : "-"}</>
            ),
        },
    ];

    const data_table = filtered_users.value ? (
        <DataTable
            data={filtered_users.value}
            columns={columns}
            checkboxes={checkboxes}
            id_key="id"
            name_key="name"
            detail_path_prefix="/users"
        />
    ) : null;

    return (
        <ListPageLayout
            title="Users"
            error={maybe_rows.value?.[0]}
            actions_area={actions_area}
            data_table={data_table}
        />
    );
};
