import { JSX } from "preact/jsx-runtime";

type ActionComponentProps = {
    name: string;
    placeholder?: string;
    oninput?: JSX.InputEventHandler<HTMLInputElement>;
    onsubmit?: JSX.SubmitEventHandler<HTMLFormElement>;
};

export const ActionComponent = ({ name, placeholder, oninput, onsubmit }: ActionComponentProps) => {
    return (
        <form
            class="flex flex-row items-center px-4 py-2 gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                onsubmit?.(e);
                e.currentTarget.reset();
            }}
        >
            <span>
                <input type="submit" value={name} class={onsubmit && "clickable"}></input>:
            </span>
            <input class="w-full" onInput={oninput} placeholder={placeholder} name="input" autoComplete="off"></input>
        </form>
    );
};
