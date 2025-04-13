import { qtd } from "../utils/qt";
import { descriptionInput, easyMDE, nameInput, sidebar, tagList } from "./var";

qtd<HTMLButtonElement>("save", sidebar).addEventListener("click", async () => {
    if (!confirm("Are you sure you want to save?")) {
        return;
    }
    const name = nameInput.value;
    if (!name) {
        alert("Please enter a name");
        return;
    }
    const markdown = easyMDE.value();
    const tags = tagList.listController.getItems().map((item) => item.value);
    const description = descriptionInput.value;

    const res = await fetch("/api/md", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            id: name,
            content: markdown,
            tags,
            desc: description,
        }),
    }).then((res) => res.json());

    if (res.err) {
        alert(res.msg);
    } else {
        alert("Saved!");
    }
});

qtd<HTMLButtonElement>("delete", sidebar).addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete?")) {
        return;
    }
    const name = nameInput.value;
    const res = await fetch("/api/md", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            id: name,
        }),
    }).then((res) => res.json());

    if (res.err) {
        alert(res.msg);
    } else {
        alert("Deleted!");
    }
});

qtd<HTMLButtonElement>("load", sidebar).addEventListener("click", async () => {
    const name = nameInput.value;
    const res = await fetch(`/api/md/${name}`);
    const data = await res.json();
    if (data.err) {
        alert(data.msg);
        return;
    }
    easyMDE.value(data.content);
    if (data.meta.tags) tagList.listController.setItems(data.meta.tags.map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = data.meta?.desc || "";
});
