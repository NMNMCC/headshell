import { useRoute } from "preact-iso";

export const NodesEdit = () => {
    const { params } = useRoute();
    const { id } = params;

    return <>{id}</>;
};
