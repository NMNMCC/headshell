import { Signal } from "@preact/signals";
import { Typography } from "@mui/joy";
import { ShowError } from "../utils/Error";
import { AnyComponent, ComponentChild } from "preact";

type ListPageLayoutProps<T> = {
    title: string;
    error: string | undefined;
    actions_area: ComponentChild;
    data_table: ComponentChild;
};

export const ListPageLayout = <T,>({ title, error, actions_area, data_table }: ListPageLayoutProps<T>) => {
    return (
        <div class="w-full h-full flex flex-col justify-start gap-4 overflow-hidden">
            <Typography level="h2">{title}</Typography>
            {error ? (
                <ShowError error={error} />
            ) : (
                <div class="w-full h-full flex flex-col">
                    <div class="flex flex-col bg-gray-100">{actions_area}</div>
                    {data_table}
                </div>
            )}
        </div>
    );
};
