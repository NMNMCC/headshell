import { ComponentPropsWithoutRef } from "preact/compat";

export const StyledInput = (props: ComponentPropsWithoutRef<"input">) => (
    <input
        class="w-64 p-2 font-mono text-sm bg-gray-50 hover:bg-gray-100 hover:outline-none! focus:outline-none!"
        {...props}
        required
    ></input>
);
