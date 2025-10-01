import { fetchVQL } from "@wxn0brp/vql-client";
import { descriptionInput, easyMDE, nameInput, nameSelect, sidebar, tagList } from "./var";

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
        db: "api-cms-admin",
        d: {
            updateOneOrAdd: {
                collection: "md",
                search: { id: name },
                updater: { content, tags, desc },
            }
        }
    });
    alert(res ? "Saved!" : "Not found");
    renderNameSelect();
});

sidebar.qi<HTMLButtonElement>("delete").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete?")) {
        return;
    }
    const name = nameInput.value;
    const res = await fetchVQL("api-cms-admin -md! s.id = $id", { id: name });
    alert(res ? "Deleted!" : "Not found");
});

sidebar.qi<HTMLButtonElement>("load").addEventListener("click", async () => {
    const name = nameInput.value;
    if (!name) {
        alert("Please enter a name");
        return;
    }
    load(name);
});

async function load(name: string) {
    const data = await fetchVQL("api-cms-admin md! s.id = $id", { id: name });
    if (!data) {
        alert("Not found");
        return;
    }
    easyMDE.value(data.content);
    if (data.tags) tagList.listController.setItems(data.tags.map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = data.desc || "";
}

nameSelect.addEventListener("change", () => {
    const name = nameSelect.value;
    nameInput.value = name;
    if (name) load(name);
    else {
        if (confirm("Are you sure you want to clear?")) {
            easyMDE.value("");
        }
    }
});

renderNameSelect();

async function renderNameSelect() {
    const list = await fetchVQL("api-cms-admin md s.id=0");
    const options = list.map((item) => `<option value="${item.name}">${item.name}</option>`);
    nameSelect.innerHTML = `<option value="">New</option>` + options.join("");
}