import { fail, Maybe, succeed } from "@intzaaa/maybe";

export const set = <K extends string>(key: K, value: string): Maybe<string> => {
    sessionStorage.setItem(key, value);
    return succeed(value);
};
export const get = <K extends string>(key: K): Maybe<string> => {
    const value = sessionStorage.getItem(key);
    if (!value) return fail(`${key} does not exist`);
    return succeed(value);
};
