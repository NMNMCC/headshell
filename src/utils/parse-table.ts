import { filter, map, reduce, zip } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";

export const parseTable = (table: string): object => {
    const raw = pipe(
        table.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/gmu, "").split("\n"),
        filter((line) => line.trim() !== ""),
        map((line) => line.split("|").map((cell) => cell.trim())),
    );

    return pipe(
        raw.slice(1),
        reduce<string[], [string, string][][]>([], (acc, row) => [...acc, zip(raw[0]!, row)]),
        map(Object.fromEntries),
    );
};
