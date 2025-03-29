import { Link, Tooltip, Typography } from "@mui/joy";
import { Auth } from "./Auth";

export function Header() {
    return (
        <header class="w-full h-fit py-4 px-8 bg-gray-100 flex flex-row justify-between items-center gap-8 shadow-2xl shadow-gray-50">
            <div>
                <Typography level="title-lg">HeadShell</Typography>
                <Typography
                    level="body-md"
                    variant="plain"
                    className="flex! flex-row gap-4"
                >
                    {[
                        {
                            name: "Nodes",
                            path: "/nodes",
                        },
                        {
                            name: "Users",
                            path: "/users",
                        },
                    ].map(({ name, path }) => (
                        <Link href={path} textColor="common.black">
                            {name}
                        </Link>
                    ))}
                </Typography>
            </div>
            <Tooltip
                placement="bottom-start"
                variant="plain"
                size="lg"
                keepMounted={true}
                leaveDelay={250}
                title={Auth()}
            >
                <Typography
                    level="body-lg"
                    className="h-full flex! flex-col items-center justify-center pl-12"
                >
                    Auth
                </Typography>
            </Tooltip>
        </header>
    );
}
