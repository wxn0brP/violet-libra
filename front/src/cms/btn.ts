import { confirm, uiMsg } from "@wxn0brp/flanker-dialog";
import { fetchVQL } from "@wxn0brp/vql-client";
import { descriptionInput, easyMDE, nameInput, nameSelect, privateCheckbox, scheduledInput, sidebar, tagList } from "./var";
import { UpdaterArg } from "@wxn0brp/vql-client/vql";

sidebar.qs<HTMLButtonElement>("save", 1).addEventListener("click", async () => {
    if (!await confirm("Are you sure you want to save?")) return;

    const name = nameInput.value;
    if (!name) return uiMsg("Please enter a name");

    const content = easyMDE.value();
    if (!content) return uiMsg("Please enter some content");

    const tags = tagList.listController.getItems().map((item) => item.value);
    const desc = descriptionInput.value;
    const isPrivate = privateCheckbox.checked;
    let scheduled = scheduledInput.value ? new Date(scheduledInput.value).getTime() : 0;

    const updater: UpdaterArg = {
        content,
        tags,
        desc,
        $unset: {}
    }

    if (isPrivate) updater.private = true;
    else updater.$unset.private = true;

    if (scheduled > Date.now()) updater.scheduled = scheduled;
    else updater.$unset.scheduled = true;

    const res = await fetchVQL({
        db: "api-cms-admin",
        d: {
            updateOneOrAdd: {
                collection: "md",
                search: { id: name },
                updater,
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
    const { content, meta } = data;

    easyMDE.value(content);
    if (meta.tags) tagList.listController.setItems(meta.tags.map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = meta.desc || "";
    privateCheckbox.checked = !!meta.private;

    if (meta.scheduled && meta.scheduled > 0) {
        const scheduledDate = new Date(meta.scheduled);
        scheduledInput.value = scheduledDate.toISOString().slice(0, 16);
    } else {
        scheduledInput.value = "";
    }
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