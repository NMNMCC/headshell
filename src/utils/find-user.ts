import { fail, Maybe, succeed } from "@intzaaa/maybe";
import { path, UserInfo } from "../handlers/users/list";
import { get } from "../stores/store";

export const find_user = (id: number): Maybe<UserInfo> => {
    const users = get<Maybe<UserInfo[]>>(path);
    if (!users.value) return fail("No users found");

    const [err, __users__] = users.value;
    if (err) return fail(err.description);

    const user = __users__.find((user) => user.id === id);
    if (!user) return fail("User not found");

    return succeed(user);
};
