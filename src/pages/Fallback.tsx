import { AnyComponent } from "preact";
import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";
import { entries } from "../components/base/Header";

export const Fallback: AnyComponent = () => {
    const location = useLocation();

    useEffect(() => {
        entries.value = [
            {
                name: "Back",
                path: "/",
            },
        ];
    }, []);
    return <div>{location.path} does not exist</div>;
};
