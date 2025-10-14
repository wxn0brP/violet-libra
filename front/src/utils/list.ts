class ListController {
    private items: Array<{ type: "input" | "select", value: string }> = [];

    constructor(
        private listElement: HTMLUListElement,
        private availableOptions: string[] = []
    ) { }

    getItems(): Array<{ type: "input" | "select", value: string }> {
        return this.items;
    }

    private getAvailableOptions(excepted: string): string[] {
        const items = this.getItems().filter(item => item.type === "select").map(item => item.value);
        const options = this.availableOptions.filter(option => {
            if (excepted && option === excepted) return true;
            return !items.includes(option)
        });
        return options;
    }

    setItems(items: Array<{ type: "input" | "select", value: string }>): void {
        this.items = items;
        this.renderList();
    }

    addItem(type: "input" | "select", value: string = ""): void {
        const item = { type, value };
        this.items.push(item);
        this.renderList();
    }

    removeItem(index: number): void {
        this.items.splice(index, 1);
        this.renderList();
    }

    editItem(index: number, newValue: string): void {
        if (index >= 0 && index < this.items.length) {
            const item = this.items[index];

            item.value = newValue;
            if (item.type === "select") {
                this.renderList();
            }
        }
    }

    private renderList(): void {
        this.listElement.innerHTML = "";

        this.items.forEach((item, index) => {
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
                const options = this.getAvailableOptions(item.value);
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

            this.listElement.appendChild(li);
        });
    }
}

export { ListController };

export interface ListCfg {
    type: "input" | "select" | "mixed";
    options?: string[];
    append?: boolean;
}

export default function createListController(container: HTMLElement, cfg: ListCfg) {
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