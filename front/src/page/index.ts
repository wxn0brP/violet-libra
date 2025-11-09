import "@wxn0brp/flanker-ui/html";
import "../style/style.scss";
import Fuse from "fuse.js";

const searchInput = qs<HTMLInputElement>("#searchInput");
searchInput.addEventListener("input", performSearch);

const allPosts = [...document.querySelectorAll("main li")] as HTMLLIElement[];
const titles = Array.from(allPosts).map(post => post.textContent);

function performSearch() {
    const value = searchInput.value.trim();
    if (!value) {
        allPosts.forEach(el => el.css("display", ""));
        return;
    }

    const fuse = new Fuse(titles, {
        keys: ["textContent"],
        includeScore: true,
        threshold: 0.4,
    });

    const results = fuse.search(value);
    allPosts.forEach(el => el.css("display", "none"));
    for (const result of results)
        allPosts[result.refIndex].css("display", "");
}