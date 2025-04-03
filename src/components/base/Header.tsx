import { signal } from "@preact/signals";
import { useLocation } from "preact-iso";
import { get_auth } from "../../stores/store";
import { ActionButton } from "../utils/ActionButton";

export const entries = signal<
    ({ name: string } & (
        | {
              path: string;
          }
        | {
              action: () => void;
          }
    ))[]
>([]);

export const Header = () => {
    const location = useLocation();
    const auth = get_auth();

    return (
        <header
            style={{
                background: `linear-gradient(to left, ${auth.value ? "lightgreen" : "#FFCCCB"}, #f3f4f6 50%)`,
            }}
            class="flex h-fit w-full flex-col gap-2 px-8 py-4"
        >
            <div className="flex flex-row gap-4 **:text-lg">
                <ActionButton name="HeadShell" path="/" className="font-black! text-black!"></ActionButton>
                {location.path
                    .split("/")
                    .filter(Boolean)
                    .map((cur, index, array) => (
                        <>
                            {index === 0 ? <span>/</span> : undefined}
                            <ActionButton
                                name={cur}
                                path={`/${array.slice(0, index + 1).join("/")}`}
                                class="capitalize"
                            />
                            {index !== array.length - 1 ? <span>/</span> : undefined}
                        </>
                    ))}
            </div>
            <div class="flex flex-row justify-between **:text-sm!">
                <div class="flex flex-row gap-2">
                    {entries.value.map((entry) => (
                        <ActionButton
                            name={entry.name}
                            {...("path" in entry
                                ? {
                                      path: entry.path,
                                  }
                                : {
                                      action: entry.action,
                                  })}
                        ></ActionButton>
                    ))}
                </div>
                <div>
                    <ActionButton name="Auth" path="/auth"></ActionButton>
                </div>
            </div>
        </header>
    );
};
