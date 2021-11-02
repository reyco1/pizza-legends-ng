import { KeyPressListener } from "../utils/key-press-listener";

export class TextMessage {

    private text: string;
    private onComplete: Function;
    private element: HTMLDivElement | null;
    private actionListener: KeyPressListener | null;

    constructor(config: TextMessageConfig) {
        this.text = config.text;
        this.onComplete = config.onComplete;
        this.element = null;
        this.actionListener = null;
    }

    init(container: any) {
        this.createElement();
        container.appendChild(this.element);
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('text-message');
        this.element.innerHTML = (`
            <p class="text-message_p">${this.text}</p>
            <button class="text-message_button">Next</button>
        `);
        this.element.querySelector('button')?.addEventListener('click', () => this.done());
        this.actionListener = new KeyPressListener('Enter', () => {
            this.actionListener?.unbind();
            this.done();
        })
    }

    done() {
        this.element?.remove();
        this.onComplete();
    }
}

export interface TextMessageConfig {
    text: string;
    onComplete: Function;
}