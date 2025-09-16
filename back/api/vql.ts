import VQLProcessor from "@wxn0brp/vql";
import db from "../cms/data.cms";
import { apiAdapter } from "./api";

const VQL = new VQLProcessor({
    ...db,
    api: apiAdapter
});

export default VQL;