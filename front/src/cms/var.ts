import EasyMDE from "easymde";
import createListController from "../utils/list";

export const sidebar = qs("#sidebar");

export const easyMDE = new EasyMDE({
    theme: "dark",
    element: qs("#editor"),
    spellChecker: true,
});
qs("#editor").remove();

export const tagsListUl = sidebar.qs<HTMLUListElement>("tags", 1);
export const nameInput = sidebar.qi("name", 1);
export const nameSelect = sidebar.qs<HTMLSelectElement>("name-select", 1);
export const descriptionInput = sidebar.qi("description", 1);

export const tagList = createListController(tagsListUl, {
    type: "mixed",
    options: ["tag1", "tag2", "tag3"],
});
