import { confirm, uiMsg } from "@wxn0brp/flanker-dialog";
import { fetchVQL } from "@wxn0brp/vql-client";
import { descriptionInput, easyMDE, nameInput, nameSelect, sidebar, tagList } from "./var";

sidebar.qs<HTMLButtonElement>("save", 1).addEventListener("click", async () => {
    if (!await confirm("Are you sure you want to save?")) return;

    const name = nameInput.value;
    if (!name) return uiMsg("Please enter a name");

    const content = easyMDE.value();
    if (!content) return uiMsg("Please enter some content");

    const tags = tagList.listController.getItems().map((item) => item.value);
    const desc = descriptionInput.value;

    const res = await fetchVQL({
        db: "api-cms-admin",
        d: {
            updateOneOrAdd: {
                collection: "md",
                search: { id: name },
                updater: { content, tags, desc },
            }
        }
    });
    uiMsg(res ? "Saved!" : "Not found");
    renderNameSelect();
});

sidebar.qs<HTMLButtonElement>("delete", 1).addEventListener("click", async () => {
    if (!await confirm("Are you sure you want to delete?")) return;

    const name = nameInput.value;
    const res = await fetchVQL("api-cms-admin -md! s.id = $id", { id: name });
    uiMsg(res ? "Deleted!" : "Not found");
});

sidebar.qs<HTMLButtonElement>("load", 1).addEventListener("click", async () => {
    const name = nameInput.value;
    if (!name) return uiMsg("Please enter a name");
    load(name);
});

async function load(name: string) {
    const data = await fetchVQL("api-cms-admin md! s.id = $id", { id: name });
    if (!data) return uiMsg("Not found");

    easyMDE.value(data.content);
    if (data.tags) tagList.listController.setItems(data.tags.map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = data.desc || "";
}

nameSelect.addEventListener("change", async () => {
    const name = nameSelect.value;
    nameInput.value = name;
    if (name) return load(name);
    if (!await confirm("Are you sure you want to clear?")) return
    easyMDE.value("");
});

renderNameSelect();

async function renderNameSelect() {
    const list = await fetchVQL("api-cms-admin md s.id=0");
    const options = list.map((item) => `<option value="${item.name}">${item.name}</option>`);
    nameSelect.innerHTML = `<option value="">New</option>` + options.join("");
}