import { Signal, effect } from "@preact/signals";
import { Action } from "../utils/Action";

type Column<T> = {
    header: string;
    key?: keyof T;
    render?: (item: T) => preact.JSX.Element;
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    checkboxes: Signal<number[]>;
    id_key: keyof T;
    detail_path_prefix: string;
    name_key: keyof T;
};

export const DataTable = <T,>({
    data,
    columns,
    checkboxes,
    id_key,
    detail_path_prefix,
    name_key,
}: DataTableProps<T>) => {
    return (
        <div
            style={{
                scrollbarWidth: "thin",
            }}
            class="overflow-x-scroll w-full h-full bg-gray-50"
        >
            <table class="w-full table-auto p-2">
                <thead class="text-left">
                    <tr class="*:p-2 border-b border-gray-200">
                        <th>
                            <input
                                type="checkbox"
                                ref={(el) => {
                                    effect(() => {
                                        if (el) {
                                            const length = checkboxes.value.length;
                                            if (length === data.length) {
                                                el.indeterminate = false;
                                                el.checked = true;
                                            } else if (length === 0) {
                                                el.indeterminate = false;
                                                el.checked = false;
                                            } else {
                                                el.indeterminate = true;
                                            }
                                        }
                                    });
                                }}
                                onChange={() => {
                                    if (checkboxes.value.length > 0) {
                                        checkboxes.value = [];
                                    } else {
                                        checkboxes.value =
                                            data.map((item) => Number(item[id_key])).filter((id) => !isNaN(id)) ?? [];
                                    }
                                }}
                            ></input>
                        </th>
                        {columns.map((column) => (
                            <th key={column.header}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody class="bg-gray-50">
                    {data.map((item) => (
                        <tr key={String(item[id_key])} class="*:p-2 border-b border-gray-200">
                            <td>
                                <input
                                    key={String(item[id_key])}
                                    type="checkbox"
                                    ref={(el) => {
                                        effect(() => {
                                            if (el && item[id_key]) {
                                                el.checked = checkboxes.value.includes(Number(item[id_key]));
                                            }
                                        });
                                    }}
                                    onChange={(e) => {
                                        if (item[id_key]) {
                                            const id = Number(item[id_key]);
                                            checkboxes.value = [
                                                ...checkboxes.value.filter((i) => i !== id),
                                                ...(e.currentTarget.checked ? [id] : []),
                                            ];
                                        }
                                    }}
                                ></input>
                            </td>
                            {columns.map((column) => (
                                <td key={column.header}>
                                    {column.key === name_key ? (
                                        <Action
                                            name={String(item[name_key] ?? undefined)}
                                            path={`${detail_path_prefix}/${item[id_key]}`}
                                        ></Action>
                                    ) : column.render ? (
                                        column.render(item)
                                    ) : column.key ? (
                                        String(item[column.key] ?? undefined)
                                    ) : undefined}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
