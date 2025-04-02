import { effect, Signal, signal } from "@preact/signals";
import { nodes_handler } from "../handlers/nodes";
import { users_handler } from "../handlers/users";
import { routes_handler } from "../handlers/routes";
import { apikeys_handler } from "../handlers/apikeys";

const signals = new Map<string, Signal<any>>();

export const set = <V>(key: string, value: V): Signal<V> => {
    sessionStorage.setItem(key, JSON.stringify(value));

    const _ = signals.get(key) ?? signal(value);
    _.value = value;

    signals.set(key, _);

    return _;
};

export const get = <V>(key: string): Signal<V | undefined> => {
    if (signals.has(key)) return signals.get(key) as Signal<V | undefined>;

    const value = sessionStorage.getItem(key);

    const _ = signal(value ? JSON.parse(value) : undefined);

    signals.set(key, _);

    return _;
};

type Auth = {
    username: string;
    password: string;
} | null;

export const set_auth = ((username?: string, password?: string) =>
    username && password ? set<Auth>("auth", { username, password }) : set<Auth>("auth", null)) as {
    (): Signal<null>;
    (username: string, password: string): Signal<Exclude<Auth, undefined>>;
};

export const get_auth = () => get<Auth>("auth");

effect(() => {
    const auth = get_auth();
    if (!auth) return;

    nodes_handler.list();
    users_handler.list();
    routes_handler.list();
    apikeys_handler.list();
});
