import { ComponentChild } from "preact";

const Row = ({ k, v }: { k: string; v: ComponentChild }) => (
    <tr key={k} class="border-b border-gray-200 *:p-2">
        <th class="text-left capitalize">{k.replace("_", " ")}</th>
        <td class="break-all">{v}</td>
    </tr>
);

export const DetailTable = ({ rows }: { rows: [string, ComponentChild][] }) => {
    return (
        <table class="h-full w-full table-auto overflow-hidden">
            <tbody>
                {rows.map(([k, v]) => (
                    <Row key={k} k={k} v={v} />
                ))}
            </tbody>
        </table>
    );
};
