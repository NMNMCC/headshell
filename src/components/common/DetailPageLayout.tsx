import { Typography } from "@mui/joy";
import { ComponentChild } from "preact";
import { ShowError } from "../utils/Error";

type DetailPageLayoutProps = {
    title: string;
    subtitle?: string;
    error?: string;
    actions_area: ComponentChild;
    details_area: ComponentChild;
};

export const DetailPageLayout = ({ title, subtitle, error, actions_area, details_area }: DetailPageLayoutProps) => {
    return (
        <div class="w-full h-full flex flex-col justify-start gap-4 overflow-hidden">
            {error ? (
                <ShowError error={error} />
            ) : (
                <div class="w-full h-full flex flex-col gap-4 overflow-hidden">
                    <Typography level="h2">
                        {title} {subtitle && <span class="text-sm">{subtitle}</span>}
                    </Typography>
                    <div class="w-full h-fit flex flex-row flex-nowrap overflow-hidden">
                        <div class="flex flex-col w-64! shrink-0 bg-gray-100">{actions_area}</div>
                        <div
                            style={{
                                scrollbarWidth: "thin",
                            }}
                            class="w-0 grow h-fit overflow-x-auto"
                        >
                            {details_area}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
