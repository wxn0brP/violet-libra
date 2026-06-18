export class ListController {
    _items: Array<{ type: "input" | "select", value: string }> = [];

    constructor(
        public _listElement: HTMLUListElement,
        public _availableOptions: string[] = []
    ) { }

    getItems(): Array<{ type: "input" | "select", value: string }> {
        return this._items;
    }

    setAvailableOptions(options: string[]) {
        this._availableOptions = options;
        this._renderList();
    }

    _getAvailableOptions(excepted: string) {
        const items = this.getItems().filter(item => item.type === "select").map(item => item.value);
        const options = this._availableOptions.filter(option => {
            if (excepted && option === excepted) return true;
            return !items.includes(option)
        });
        return options;
    }

    setItems(items: Array<{ type: "input" | "select", value: string }>) {
        this._items = items;
        this._renderList();
    }

    addItem(type: "input" | "select", value: string = "") {
        const item = { type, value };
        this._items.push(item);
        this._renderList();
        this._emitChange();
    }

    removeItem(index: number) {
        this._items.splice(index, 1);
        this._renderList();
        this._emitChange();
    }

    editItem(index: number, newValue: string) {
        if (index >= 0 && index < this._items.length) {
            const item = this._items[index];

            item.value = newValue;
            if (item.type === "select") {
                this._renderList();
            }
            this._emitChange();
        }
    }

    _emitChange() {
        this._listElement.dispatchEvent(new CustomEvent("list-change", { bubbles: true }));
    }

    _renderList() {
        this._listElement.innerHTML = "";

        this._items.forEach((item, index) => {
            const li = document.createElement("li");

            if (item.type === "input") {
                const input = document.createElement("input");
                input.type = "text";
                input.value = item.value;
                input.addEventListener("change", (e) => {
                    this.editItem(index, (e.target as HTMLInputElement).value);
                });
                li.appendChild(input);
            } else if (item.type === "select") {
                const options = this._getAvailableOptions(item.value);
                if (options.length === 0) return;

                const select = document.createElement("select");

                const emptyOption = document.createElement("option");
                emptyOption.value = "";
                emptyOption.textContent = ""
                select.appendChild(emptyOption);

                options.forEach(option => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option;
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });

                select.value = item.value || "";
                select.addEventListener("change", (e) => {
                    this.editItem(index, (e.target as HTMLSelectElement).value);
                });
                li.appendChild(select);
            }

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                this.removeItem(index);
            });
            li.appendChild(removeButton);

            this._listElement.appendChild(li);
        });
    }
}

export interface ListCfg {
    type: "input" | "select" | "mixed";
    options?: string[];
    append?: boolean;
}

export function createListController(container: HTMLElement, cfg: ListCfg) {
    cfg = {
        type: "input",
        options: [],
        append: true,
        ...cfg
    }

    const listElement = document.createElement("ul");
    listElement.className = "list";
    const listController = new ListController(listElement, cfg.options);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    container.appendChild(addButton);
    addButton.addEventListener("click", () => {
        listController.addItem("input", "");
    });

    if (cfg.type === "select" || cfg.type === "mixed") {
        const addSelectButton = document.createElement("button");
        addSelectButton.textContent = "Add Select";
        container.appendChild(addSelectButton);
        addSelectButton.addEventListener("click", () => {
            listController.addItem("select");
        });
    }

    container.appendChild(listElement);

    return {
        listController,
        addButton,
        listElement,
        container
    }
}
