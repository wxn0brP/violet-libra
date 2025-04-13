export function qt<T=HTMLDivElement>(selector: string, root: Document | HTMLElement = document) {
    return root.querySelector(selector) as T;
}

export function qtd<T=HTMLInputElement>(selector: string, root: Document | HTMLElement = document) {
    return root.querySelector("[data-id='" + selector + "']") as T;
}