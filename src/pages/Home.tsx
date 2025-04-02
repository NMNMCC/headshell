import { useEffect } from "preact/hooks";
import { entries } from "../components/base/Header";

export const Home = () => {
    useEffect(() => {
        entries.value = [
            {
                name: "Nodes",
                path: "/nodes",
            },
            {
                name: "Users",
                path: "/users",
            },
        ];
    }, []);
    return <div></div>;
};
