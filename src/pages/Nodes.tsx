import {
    List,
    ListItem,
    Typography,
    CircularProgress,
    Box,
    Sheet,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { list, NodesListItem } from "../handlers/nodes/list";
import { ComponentChildren } from "preact";
import { useLocation } from "preact-iso";

const Node = (node: NodesListItem) => {
    const { route } = useLocation();

    const Info = ({
        children,
        className,
    }: {
        children: ComponentChildren;
        className?: string;
    }) => (
        <div className="text-sm font-mono text-gray-800" class={className}>
            {children}
        </div>
    );

    return (
        <ListItem
            className={`p-2! min-h-fit flex flex-col gap-4 items-start! justify-start! bg-gray-50 hover:bg-gray-100 hover:cursor-pointer ${
                node.Connected === "online" ? "" : "opacity-50"
            }`}
            onDblClick={() => route(`/nodes/${node.ID}`)}
        >
            <div
                class={`text-2xl font-mono w-full overflow-x-auto overflow-y-clip line-clamp-1 text-gray-950`}
                style={{
                    textOverflow: "clip",
                    scrollbarWidth: "none",
                }}
            >
                {node.Name} ({node.ID})
            </div>
            <div>
                <Info>Hostname: {node.Hostname}</Info>
                <Info>User: {node.User}</Info>
                <Info>Connected: {node.Connected}</Info>
                <Info>Machine Key: {node.MachineKey}</Info>
                <Info>Node Key: {node.NodeKey}</Info>
                <Info>Ephemeral: {node.Ephemeral}</Info>

                <Info>Last seen: {node["Last seen"]} </Info>
                <Info>
                    <br></br>
                </Info>
                <Info>
                    {node["IP addresses"].split(",").map((ip) => (
                        <>
                            {"IP: " + ip.trim()}
                            <br></br>
                        </>
                    ))}
                </Info>
                <Info>
                    <br></br>
                </Info>

                <Info>Expired: {node.Expired}</Info>
            </div>
        </ListItem>
    );
};

export const Nodes = () => {
    const [nodes, setNodes] = useState<NodesListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const [err, res] = await list();
                if (err) {
                    setError(err.description as string);
                } else {
                    setNodes(res || []);
                }
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();
    }, []);

    return (
        <>
            <Typography level="h1">Nodes</Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Sheet color="danger" variant="soft">
                    <Typography>{error}</Typography>
                </Sheet>
            ) : (
                <List
                    variant="plain"
                    className="grid! gap-4 p-8!"
                    sx={{
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(24rem, 1fr))",
                    }}
                >
                    {nodes.length === 0 ? (
                        <ListItem>
                            <Typography>没有找到节点</Typography>
                        </ListItem>
                    ) : (
                        nodes.map((node) => <Node {...node}></Node>)
                    )}
                </List>
            )}
        </>
    );
};
