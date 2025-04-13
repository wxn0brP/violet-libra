import EasyMDE from "easymde";
import { qt, qtd } from "../utils/qt";
import createListController from "../utils/list";

export const sidebar = qt("#sidebar");

export const easyMDE = new EasyMDE({
    theme: "dark",
    element: document.querySelector("#editor"),
    spellChecker: true,
});
document.querySelector("#editor").remove();

export const tagsListUl = qtd<HTMLUListElement>("tags", sidebar);
export const nameInput = qtd<HTMLInputElement>("name", sidebar);
export const descriptionInput = qtd<HTMLInputElement>("description", sidebar);

export const tagList = createListController(tagsListUl, {
    type: "mixed",
    options: ["tag1", "tag2", "tag3"],
});
