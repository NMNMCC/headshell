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
        <div class="flex h-full w-full flex-col justify-start gap-4 overflow-hidden">
            <Typography level="h2">{title}</Typography>
            <div class="flex h-full w-full flex-col overflow-hidden lg:h-fit lg:flex-row lg:flex-nowrap">
                <div class="flex h-fit w-full shrink-0 flex-col justify-start overflow-hidden bg-gray-100 lg:h-full lg:w-96">
                    {actions}
                </div>
                <div class="h-full w-full grow overflow-x-auto bg-gray-50 lg:w-0">{table}</div>
            </div>
            {others}
        </div>
    );
};
