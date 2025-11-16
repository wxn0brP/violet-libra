
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function renderMd(md: string) {
    const content = await marked(md);
    const html = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true }
    });

    return html;
}