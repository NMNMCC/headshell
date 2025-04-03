import { JSX } from "preact/jsx-runtime";

type ActionComponentProps = {
    name: string;
    placeholder?: string;
    oninput?: JSX.InputEventHandler<HTMLInputElement>;
    onsubmit?: JSX.SubmitEventHandler<HTMLFormElement>;
};

export const ActionText = ({ name, placeholder, oninput, onsubmit }: ActionComponentProps) => {
    return (
        <form
            class="flex flex-row items-center gap-2 px-4 py-2"
            onSubmit={(e) => {
                e.preventDefault();
                onsubmit?.(e);
                e.currentTarget.reset();
            }}
        >
            <span>
                <input type="submit" value={name} class={onsubmit && "clickable"}></input>:
            </span>
            <input
                class="line-clamp-1 w-full"
                onInput={oninput}
                placeholder={placeholder}
                name="input"
                autoComplete="off"
                required
            ></input>
        </form>
    );
};
