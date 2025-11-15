import { confirm } from "@wxn0brp/flanker-dialog";
import { fetchVQL, VConfig } from "@wxn0brp/vql-client";

function off() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "/login?next=cms";
}

if (!localStorage.getItem("authToken")) off();

let sessionQuestion = 0;
VConfig.url = `/VQL?token=${localStorage.getItem("authToken")}`;
VConfig.hooks.onError = async (query, e, res) => {
    console.log("onError");
    console.log("Q", query);
    console.log("E", e);
    console.log("R", res);
    if (!res || res.c === 403) {
        // Do not spam
        if (Date.now() - sessionQuestion > 10_000)
            return;

        const conf = await confirm("Your session probably has expired. Do you want to log out?");
        if (!conf) {
            sessionQuestion = Date.now();
            return;
        }

        off();
    }
}

fetchVQL("api-cms-admin md s.id=0").catch(() => off());