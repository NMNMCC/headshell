export type SearchConfig<T> = {
    fields: (keyof T | ((item: T) => string | string[] | null | undefined))[];
};

export const create_search_filter = <T extends Record<string, any>>(config: SearchConfig<T>) => {
    return (search_term: string, item: T): boolean => {
        if (!search_term) return true;

        const normalized_term = search_term.toLowerCase();

        return config.fields.some((field) => {
            let value: string | string[] | null | undefined;

            if (typeof field === "function") {
                value = field(item);
            } else {
                value = item[field as string];
            }

            if (value === null || value === undefined) {
                return false;
            }

            if (Array.isArray(value)) {
                return value.some((v) => typeof v === "string" && v.toLowerCase().includes(normalized_term));
            }

            return String(value).toLowerCase().includes(normalized_term);
        });
    };
};
