import { Input } from "@mui/joy";
import { auth } from "../handlers/auth";

export const Auth = () => {
    return (
        <form
            class="flex flex-row gap-2 w-fit! min-w-fit! h-fit! min-h-fit!"
            onSubmit={async (e) => {
                e.preventDefault();

                const code = new FormData(e.currentTarget)
                    .get("code")
                    ?.toString();
                if (!code) return;

                const [err] = await auth(code);
                if (err) return console.error(err);
            }}
        >
            <Input
                variant="plain"
                type="text"
                name="code"
                placeholder="code"
                className="font-mono!"
            ></Input>
            <Input variant="plain" type="submit"></Input>
        </form>
    );
};
