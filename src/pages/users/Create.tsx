import { AnyComponent } from "preact";
import { entries } from "../../components/base/Header";
import { Typography, FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "preact/compat";
import { users_handler } from "../../handlers/users";
import { StyledInput } from "../../components/common/StyledInput";

export const Create: AnyComponent = () => {
    useEffect(() => {
        entries.value = [
            {
                name: "Back",
                path: "/users",
            },
        ];
    }, []);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name") as string;

                users_handler.create(name);
            }}
            class="flex flex-col flex-nowrap gap-4"
        >
            <Typography level="h2">Create User</Typography>
            <FormControl required>
                <FormLabel>Username</FormLabel>
                <StyledInput type="text" name="name" />
            </FormControl>
            <FormControl>
                <StyledInput type="submit" value="Create" />
            </FormControl>
        </form>
    );
};
