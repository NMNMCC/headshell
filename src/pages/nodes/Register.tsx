import { AnyComponent } from "preact";
import { entries } from "../../components/base/Header";
import { get } from "../../stores/store";
import { Typography, FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "preact/compat";
import { useComputed, useSignal } from "@preact/signals";
import { nodes_handler } from "../../handlers/nodes";
import { users_ids, users_types } from "../../handlers/users";
import { StyledInput } from "../../components/utils/StyledInput";

export const Register: AnyComponent = () => {
    const search = useSignal("");
    const maybe_users = get<users_types["list"]>(users_ids.list);
    const filtered_users = useComputed(() =>
        maybe_users.value?.[1]?.filter((user) => user.name?.toLowerCase().includes(search.value.toLowerCase())),
    );

    useEffect(() => {
        entries.value = [
            {
                name: "Back",
                path: "/nodes",
            },
        ];
    }, []);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target as HTMLFormElement);
                const key = formData.get("key") as string;
                const user = formData.get("user") as string;

                nodes_handler.register(key, user);
            }}
            class="flex flex-col flex-nowrap gap-4"
        >
            <Typography level="h2">Register Node</Typography>
            <FormControl required>
                <FormLabel>Node Key</FormLabel>
                <StyledInput type="text" name="key" />
            </FormControl>
            <FormControl required>
                <FormLabel>Username</FormLabel>
                <StyledInput
                    type="text"
                    value={search.value}
                    onInput={(e) => {
                        search.value = e.currentTarget.value;
                    }}
                />
                <select
                    name="user"
                    class="w-64 bg-gray-100 p-2 font-mono text-sm hover:bg-gray-100 hover:outline-none! focus:outline-none!"
                >
                    {filtered_users.value?.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </FormControl>
            <FormControl>
                <StyledInput type="submit" value="Register" />
            </FormControl>
        </form>
    );
};
