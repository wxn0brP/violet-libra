export type CfgKey =
    | "app.name"
    | "rate.count"
    | "rate.per";

export interface ConfigValue {
    _id?: string;
    k: string;
    v: string;
}
