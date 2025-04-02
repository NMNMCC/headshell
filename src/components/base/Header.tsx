import { signal } from "@preact/signals";
import { useLocation } from "preact-iso";
import { get_auth } from "../../stores/store";
import { Action } from "../utils/Action";

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
            class="w-full h-fit px-8 py-4 flex flex-col gap-2"
        >
            <div className="**:text-lg flex flex-row gap-4">
                <Action name="HeadShell" path="/" className="font-black! text-black!"></Action>
                {location.path
                    .split("/")
                    .filter(Boolean)
                    .map((cur, index, array) => (
                        <>
                            {index === 0 ? <span>/</span> : undefined}
                            <Action name={cur} path={`/${array.slice(0, index + 1).join("/")}`} class="capitalize" />
                            {index !== array.length - 1 ? <span>/</span> : undefined}
                        </>
                    ))}
            </div>
            <div class="flex flex-row justify-between **:text-sm!">
                <div class="flex flex-row gap-2">
                    {entries.value.map((entry) => (
                        <Action
                            name={entry.name}
                            {...("path" in entry
                                ? {
                                      path: entry.path,
                                  }
                                : {
                                      action: entry.action,
                                  })}
                        ></Action>
                    ))}
                </div>
                <div>
                    <Action name="Auth" path="/auth"></Action>
                </div>
            </div>
        </header>
    );
};
