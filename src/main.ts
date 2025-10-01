import router from "./router";
import FalconFrame from "@wxn0brp/falcon-frame";
import { FF_VQL } from "@wxn0brp/vql";
import VQL from "./api/vql";
import { getUser } from "./api/getUser";
import { accountRouter } from "./api/account";

const app = new FalconFrame();

app.setVar("views", "public/dynamic");
app.static("public/static");
app.static("/js", "front/dist");
app.use(router);
FF_VQL(app, VQL, { getUser });
app.use("/api/account", accountRouter);

app.listen(+process.env.PORT || 15987, true);