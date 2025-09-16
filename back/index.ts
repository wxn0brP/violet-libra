import dotenv from "dotenv";
import sourceMap from "source-map-support";
import router from "./router";
import FalconFrame from "@wxn0brp/falcon-frame";
dotenv.config({ quiet: true });
sourceMap.install();

const app = new FalconFrame();

app.static("front/static");
app.static("/js", "front-app/dist");
app.use(router);

app.listen(15987, true);