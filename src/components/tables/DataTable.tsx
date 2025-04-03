import { Signal } from "@preact/signals";
import { ComponentChild } from "preact";

export const DataTable = ({
    headers,
    rows,
    selected_rows,
}: {
    headers: ComponentChild[];
    rows: [key: string, cell: ComponentChild[]][];
    selected_rows: Signal<number[]>;
}) => {
    return (
        <div class="h-full w-full overflow-auto bg-gray-50">
            <table class="w-full table-auto">
                <thead class="bg-gray-100 text-left">
                    <tr class="border-b border-gray-200">
                        <th class="w-10 p-2">
                            <input
                                type="checkbox"
                                checked={selected_rows.value.length === rows.length && rows.length > 0}
                                indeterminate={
                                    selected_rows.value.length > 0 && selected_rows.value.length < rows.length
                                }
                                onChange={(e) => {
                                    const selected = e.currentTarget.checked;
                                    selected_rows.value = selected ? rows.map(([key]) => Number(key)) : [];
                                }}
                            />
                        </th>
                        {headers.map((header, index) => (
                            <th key={index} class="p-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody class="bg-gray-50">
                    {rows.map(([key, cells]) => {
                        const isSelected = selected_rows.value.includes(Number(key));

                        return (
                            <tr key={key} class="border-b border-gray-200">
                                <td class="p-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const selected = e.currentTarget.checked;
                                            selected_rows.value = selected
                                                ? [
                                                      ...selected_rows.value.filter((id) => id !== Number(key)),
                                                      Number(key),
                                                  ]
                                                : selected_rows.value.filter((id) => id !== Number(key));
                                        }}
                                    />
                                </td>
                                {cells.map((cell, index) => (
                                    <td key={index} class="p-2">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
