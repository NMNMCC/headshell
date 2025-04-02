export const json_line = (strings: TemplateStringsArray, ...values: any[]) =>
    String.raw({ raw: strings }, ...values) + "/-o/json-line";
