import { Signal } from "@preact/signals";

export type Value<T> = T | Signal<T> | (() => Value<T>);

export const value = <T>(value: Value<T>): T => {
    if (value instanceof Signal) return value.value;
    if (typeof value === "function") return (value as Function)();
    return value;
};
