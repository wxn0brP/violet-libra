import { confirm } from "@wxn0brp/flanker-dialog/confirm";
import { uiMsg } from "@wxn0brp/flanker-dialog/msg/index";
import { fetchVQL } from "@wxn0brp/vql-client";
import { UpdaterArg } from "@wxn0brp/vql-client/vql";
import { descriptionInput, easyMDE, nameInput, nameSelect, privateCheckbox, scheduledInput, sidebar, statusLabel, tagList } from "./var";

interface PostMeta {
    name: string;
    desc?: string;
    tags?: string[];
    private?: boolean;
    scheduled?: number;
}

let currentName = "";
let dirty = false;

const saveButton = sidebar.qs<HTMLButtonElement>("save", 1);
const deleteButton = sidebar.qs<HTMLButtonElement>("delete", 1);
const newButton = sidebar.qs<HTMLButtonElement>("new", 1);

saveButton.addEventListener("click", save);
deleteButton.addEventListener("click", remove);
newButton.addEventListener("click", newPost);

for (const input of [nameInput, descriptionInput, privateCheckbox, scheduledInput]) {
    input.addEventListener("input", markDirty);
    input.addEventListener("change", markDirty);
}
tagList.listElement.addEventListener("list-change", markDirty);
easyMDE.codemirror.on("change", markDirty);

nameSelect.addEventListener("change", async () => {
    const name = nameSelect.value;
    if (!await canDiscardChanges()) {
        nameSelect.value = currentName;
        return;
    }

    if (!name) {
        clearForm();
        return;
    }

    await load(name);
});

void init();

async function init() {
    await Promise.all([renderNameSelect(), refreshTagOptions()]);
    clearForm();
}

async function save() {
    const name = nameInput.value.trim();
    if (!name) return uiMsg("Enter a post name before saving.");

    const content = easyMDE.value().trim();
    if (!content) return uiMsg("Add post content before saving.");

    const scheduled = scheduledInput.value ? new Date(scheduledInput.value).getTime() : 0;
    if (scheduledInput.value && Number.isNaN(scheduled)) return uiMsg("Scheduled date is invalid.");

    if (!await confirm(`Save "${name}"?`)) return;

    const tags = tagList.listController
        .getItems()
        .map((item) => item.value.trim())
        .filter(Boolean);
    const updater: UpdaterArg = {
        content,
        tags: [...new Set(tags)],
        desc: descriptionInput.value.trim(),
        $unset: {}
    };

    if (privateCheckbox.checked) updater.private = true;
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

    if (!res) return uiMsg(`Could not save "${name}".`);

    currentName = name;
    dirty = false;
    updateStatus();
    await Promise.all([renderNameSelect(name), refreshTagOptions()]);
    uiMsg(`Saved "${name}".`);
}

async function remove() {
    const name = nameInput.value.trim();
    if (!name) return uiMsg("Select a post to delete.");
    if (!await confirm(`Delete "${name}"?`)) return;

    const res = await fetchVQL("api-cms-admin -md! s.id = $id", { id: name });
    if (!res) return uiMsg(`Could not delete "${name}".`);

    clearForm();
    await Promise.all([renderNameSelect(), refreshTagOptions()]);
    uiMsg(`Deleted "${name}".`);
}

async function newPost() {
    if (!await canDiscardChanges()) return;
    clearForm();
}

async function load(name: string) {
    const data = await fetchVQL<{ content: string, meta: PostMeta }>("api-cms-admin md! s.id = $id", { id: name });
    if (!data) return uiMsg(`Post "${name}" was not found.`);
    const { content, meta } = data;

    currentName = meta.name || name;
    nameInput.value = currentName;
    easyMDE.value(content);
    tagList.listController.setItems((meta.tags || []).map((tag) => ({ value: tag, type: "input" })));
    descriptionInput.value = meta.desc || "";
    privateCheckbox.checked = !!meta.private;
    scheduledInput.value = meta.scheduled && meta.scheduled > 0
        ? new Date(meta.scheduled).toISOString().slice(0, 16)
        : "";

    dirty = false;
    updateStatus(meta);
}

async function renderNameSelect(selected = "") {
    const list = await fetchVQL<PostMeta[]>("api-cms-admin md s.id=0");
    const options = list
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => `<option value="${escapeAttr(item.name)}">${escapeHtml(item.name)} - ${getStatus(item)}</option>`);

    nameSelect.innerHTML = `<option value="">New post</option>` + options.join("");
    nameSelect.value = selected;
}

async function refreshTagOptions() {
    const tags = await fetchVQL<{ name: string }[]>("api-cms-admin tags s.id=0");
    tagList.listController.setAvailableOptions((tags || []).map((tag) => tag.name).filter(Boolean).sort());
}

async function canDiscardChanges() {
    if (!dirty) return true;
    return await confirm("You have unsaved changes. Discard them?");
}

function clearForm() {
    currentName = "";
    nameInput.value = "";
    nameSelect.value = "";
    easyMDE.value("");
    tagList.listController.setItems([]);
    descriptionInput.value = "";
    privateCheckbox.checked = false;
    scheduledInput.value = "";
    dirty = false;
    updateStatus();
}

function markDirty() {
    dirty = true;
    updateStatus();
}

function updateStatus(meta?: PostMeta) {
    const state = dirty ? "Unsaved" : getStatus(meta || getFormMeta());
    statusLabel.textContent = state;
    statusLabel.dataset.status = state.toLowerCase();
}

function getFormMeta(): PostMeta {
    return {
        name: nameInput.value.trim(),
        private: privateCheckbox.checked,
        scheduled: scheduledInput.value ? new Date(scheduledInput.value).getTime() : 0,
    };
}

function getStatus(meta: PostMeta) {
    if (!meta.name) return "New";
    if (meta.private) return "Private";
    if (meta.scheduled && meta.scheduled > Date.now()) return "Scheduled";
    return "Public";
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttr(value: string) {
    return escapeHtml(value).replace(/\n/g, " ");
}
