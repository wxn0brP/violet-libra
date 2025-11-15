import db from "#mgr/db.init";
import { GateWarden } from "@wxn0brp/gate-warden";

export const gw = new GateWarden(db.access);