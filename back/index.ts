import dotenv from "dotenv";
import sourceMap from "source-map-support";
dotenv.config({ quiet: true });
sourceMap.install();

import("./main");