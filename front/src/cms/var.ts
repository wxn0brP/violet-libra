import EasyMDE from "easymde";
import createListController from "../utils/list";

export const sidebar = qs("#sidebar");

export const easyMDE = new EasyMDE({
    theme: "dark",
    element: qs("#editor"),
    spellChecker: true,
});
qs("#editor").remove();

export const tagsListUl = sidebar.qi<HTMLUListElement>("tags",);
export const nameInput = sidebar.qi<HTMLInputElement>("name");
export const nameSelect = sidebar.qi<HTMLSelectElement>("name-select");
export const descriptionInput = sidebar.qi<HTMLInputElement>("description");

export const tagList = createListController(tagsListUl, {
    type: "mixed",
    options: ["tag1", "tag2", "tag3"],
});
