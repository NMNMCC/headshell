import { AnyComponent } from "preact";
import { entries } from "../components/base/Header";
import { get_auth, set_auth } from "../stores/store";
import { Typography, FormControl, FormLabel } from "@mui/joy";
import { test } from "../handlers/base";
import { ComponentPropsWithoutRef } from "preact/compat";
import { useSignalEffect } from "@preact/signals";

const StyledInput = (props: ComponentPropsWithoutRef<"input">) => (
    <input
        class="w-64 p-2 font-mono text-sm bg-gray-50 hover:bg-gray-100 hover:outline-none! focus:outline-none!"
        {...props}
        required
    ></input>
);

export const Auth: AnyComponent = () => {
    const auth = get_auth();

    useSignalEffect(() => {
        if (auth.value) {
            entries.value = [
                {
                    name: "Logout",
                    action: () => set_auth(),
                },
            ];
        } else {
            entries.value = [
                {
                    name: "Back",
                    path: "/",
                },
            ];
        }
    });

    if (auth.value) {
        return <>Login as {auth.value?.username}</>;
    } else {
        return (
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData(e.target as HTMLFormElement);
                    const username = formData.get("username") as string;
                    const password = formData.get("password") as string;

                    set_auth(username, password);

                    if (!(await test())) {
                        set_auth();
                    }
                }}
                class="flex flex-col flex-nowrap gap-4"
            >
                <Typography level="h2">Login</Typography>
                <FormControl required>
                    <FormLabel>Username</FormLabel>
                    <StyledInput type="text" name="username" />
                </FormControl>
                <FormControl required>
                    <FormLabel>Password</FormLabel>
                    <StyledInput type="password" name="password" />
                </FormControl>
                <FormControl>
                    <StyledInput type="submit" value="Login" />
                </FormControl>
            </form>
        );
    }
};
