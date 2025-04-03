import { ComponentChild } from "preact";

const Row = ({ k, v }: { k: string; v: ComponentChild }) => (
    <tr key={k} class="*:p-2 border-b border-gray-200">
        <th class="capitalize text-left">{k.replace("_", " ")}</th>
        <td class="break-all">{v}</td>
    </tr>
);

export const DetailTable = ({ rows }: { rows: [string, ComponentChild][] }) => {
    return (
        <table class="w-full h-full overflow-hidden table-auto">
            <tbody>
                {rows.map(([k, v]) => (
                    <Row key={k} k={k} v={v} />
                ))}
            </tbody>
        </table>
    );
};
