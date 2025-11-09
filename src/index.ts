import router from "./router";
import FalconFrame from "@wxn0brp/falcon-frame";
import { FF_VQL } from "@wxn0brp/vql";
import VQL from "./api/vql";
import { getUser } from "./api/getUser";
import { api } from "#api";

const app = new FalconFrame();

app.setVar("views", "public/dynamic");
app.setVar("render data", {
    page: process.env.PAGE_NAME || "VIOLET LIBRA",
});

app.static("public/static");
app.static("/js", "front/dist");
app.use(router);
FF_VQL(app, VQL, { getUser });
app.use("/api", api);
app.l(15987);

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown:", err);
});