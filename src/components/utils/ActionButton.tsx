import { ComponentProps } from "preact";

export const ActionButton = ({
    name,
    path,
    action,
    disabled,
    size = "md",
    class: _className,
    className,
    ...others
}: { name: string } & Partial<{
    size: "sm" | "md" | "lg";
    path: string;
    action: () => void;
    disabled: boolean;
}> &
    ComponentProps<"a">) => {
    return (
        <a
            {...others}
            href={path}
            onClick={action}
            class={`text-gray-600 decoration-gray-400 transition-colors hover:cursor-pointer hover:text-gray-800 hover:underline hover:decoration-gray-600 hover:underline-offset-2 ${
                disabled ? "pointer-events-none opacity-50" : ""
            } ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"} ${_className} ${className}`}
        >
            {name}
        </a>
    );
};
