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
            class={`transition-colors text-gray-600 decoration-gray-400 hover:text-gray-800 hover:decoration-gray-600 hover:underline hover:underline-offset-2 hover:cursor-pointer ${
                disabled ? "opacity-50 pointer-events-none" : ""
            } ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"} ${_className} ${className}`}
        >
            {name}
        </a>
    );
};
