import { DateObject } from "../../handlers/base";

type DetailTableProps<T extends Record<string, any>> = {
    data: T;
    excluded_keys?: string[];
};

export const DetailTable = <T extends Record<string, any>>({ data, excluded_keys = [] }: DetailTableProps<T>) => {
    const format_value = (value: any): React.ReactNode => {
        if (value === null || value === undefined) return "-";

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                return value.map((v) => (
                    <>
                        {format_value(v)}
                        <br />
                    </>
                ));
            } else if ("seconds" in value) {
                // DateObject
                return new Date((value as DateObject).seconds * 1000).toLocaleString();
            } else {
                return JSON.stringify(value);
            }
        }

        return value;
    };

    return (
        <table class="w-full h-full bg-gray-50 overflow-hidden table-auto">
            <tbody>
                {Object.entries(data)
                    .filter(([key]) => !excluded_keys.includes(key))
                    .map(([key, value]) => (
                        <tr key={key} class="*:p-2 border-b border-gray-200">
                            <th class="capitalize text-left">{key.replace("_", " ")}</th>
                            <td class="break-all">{format_value(value)}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};
