import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import sourceMap from "source-map-support";
import router from "./router";
dotenv.config();
sourceMap.install();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "front/ejs");
app.use(express.static("front/static"));
app.use("/js", express.static("front-app/dist"));
app.use(router);

const server = http.createServer(app);
server.listen(15987, () => {
    console.log("Server started on http://localhost:15987");
});