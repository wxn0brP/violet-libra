import router from "./router";
import FalconFrame from "@wxn0brp/falcon-frame";
import { FF_VQL } from "@wxn0brp/vql";
import VQL from "./api/vql";
import { getUser } from "./api/getUser";
import { accountRouter } from "./api/account";

const app = new FalconFrame();

app.setVar("views", "front/eng")
app.static("front/static");
app.static("/js", "front-app/dist");
app.use(router);
FF_VQL(app, VQL, { getUser });
app.use("/api/account", accountRouter);

app.listen(15987, true);