export interface PostMeta {
    name: string;
    desc?: string;
    tags?: string[];
    private?: boolean;
    scheduled: number;
    _id: string;
}