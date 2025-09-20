import dotenv from "dotenv";
import sourceMap from "source-map-support";
import router from "./router";
import FalconFrame from "@wxn0brp/falcon-frame";
import { FF_VQL } from "@wxn0brp/vql";
import VQL from "./api/vql";
dotenv.config({ quiet: true });
sourceMap.install();

const app = new FalconFrame();

app.setVar("views", "front/eng")
app.static("front/static");
app.static("/js", "front-app/dist");
app.use(router);
FF_VQL(app, VQL);

app.listen(15987, true);