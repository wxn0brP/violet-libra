import { fetchVQL, VConfig } from "@wxn0brp/vql-client";

VConfig.url = `/VQL?token=${localStorage.getItem("authToken")}`;
VConfig.hooks.onError = (query, e, res) => {
    console.log("onError");
    console.log("Q", query);
    console.log("E", e);
    console.log("R", res);
    if (!res || res.c === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        window.location.href = "/login?next=cms";
    }
}

fetchVQL("api-cms-admin md s.id=0").catch(() => { });