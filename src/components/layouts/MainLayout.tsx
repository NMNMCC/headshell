import { Typography } from "@mui/joy";
import { ComponentChild } from "preact";

export const MainLayout = ({
    title,
    actions,
    table,
}: {
    title: string;
    actions: ComponentChild;
    table: ComponentChild;
}) => {
    return (
        <div class="flex h-full w-full flex-col justify-start gap-4 overflow-hidden">
            <Typography level="h2">{title}</Typography>

            <div class="flex h-full w-full flex-col">
                <div class="flex flex-col bg-gray-100">{actions}</div>
                {table}
            </div>
        </div>
    );
};
