import { fetchVQL } from "@wxn0brp/vql-client";
import { descriptionInput, easyMDE, nameInput, sidebar, tagList } from "./var";

sidebar.qi<HTMLButtonElement>("save").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to save?")) {
        return;
    }
    const name = nameInput.value;
    if (!name) {
        alert("Please enter a name");
        return;
    }
    const content = easyMDE.value();
    if (!content) {
        alert("Please enter some content");
        return;
    }
    const tags = tagList.listController.getItems().map((item) => item.value);
    const desc = descriptionInput.value;

    const res = await fetchVQL({
        db: "api",
        d: {
            updateOneOrAdd: {
                collection: "md",
                search: { id: name },
                updater: { content, tags, desc },
            }
        }
    });
    alert(res ? "Saved!" : "Not found");
});

sidebar.qi<HTMLButtonElement>("delete").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete?")) {
        return;
    }
    const name = nameInput.value;
    const res = await fetchVQL({ query: "api -md! s.id = $id", var: { id: name } });
    alert(res ? "Deleted!" : "Not found");
});

sidebar.qi<HTMLButtonElement>("load").addEventListener("click", async () => {
    const name = nameInput.value;
    if (!name) {
        alert("Please enter a name");
        return;
    }
    const data = await fetchVQL({ query: "api md! s.id = $id", var: { id: name } });
    if (!data) {
        alert("Not found");
        return;
    }

    easyMDE.value(data.content);
    if (data.tags) tagList.listController.setItems(data.tags.map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = data.desc || "";
});
