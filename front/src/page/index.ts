import "@wxn0brp/flanker-ui/html";
import "../style/style.scss";
import Fuse from "fuse.js";

const searchInput = qi("#searchInput");
const emptyState = qs("#searchEmpty");
const posts = [...document.querySelectorAll<HTMLElement>(".post-card")];

const fuse = new Fuse(
    posts.map((post, index) => ({
        index,
        text: post.dataset.search || post.textContent || "",
    })),
    {
        keys: ["text"],
        includeScore: true,
        threshold: 0.35,
    }
);

searchInput.addEventListener("input", performSearch);

function performSearch() {
    const value = searchInput.value.trim();
    const visibleIndexes = value
        ? new Set(fuse.search(value).map((result) => result.item.index))
        : new Set(posts.map((_, index) => index));

    posts.forEach((post, index) => {
        post.hidden = !visibleIndexes.has(index);
    });

    emptyState.hidden = posts.length === 0 || visibleIndexes.size > 0;
}
