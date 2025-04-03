import { ActionButton } from "../utils/ActionButton";

export const ToUser = ({ name, id }: { name: string; id: number }) => {
    return <ActionButton name={name} path={`/users/${id}`} />;
};
