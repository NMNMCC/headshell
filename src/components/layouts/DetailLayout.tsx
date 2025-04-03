import { Typography } from "@mui/joy";
import { ComponentChild } from "preact";

export const DetailPageLayout = ({
    title,
    actions,
    table,
    others,
}: {
    title: string;
    actions: ComponentChild;
    table: ComponentChild;
    others?: ComponentChild;
}) => {
    return (
        <div class="w-full h-full flex flex-col justify-start gap-4 overflow-hidden">
            <Typography level="h2">{title}</Typography>
            <div class="w-full h-fit flex flex-row flex-nowrap overflow-hidden">
                <div class="w-64 h-full flex flex-col justify-start overflow-hidden bg-gray-100">{actions}</div>
                <div class="w-0 grow h-full overflow-x-auto bg-gray-50">{table}</div>
            </div>
            {others}
        </div>
    );
};
