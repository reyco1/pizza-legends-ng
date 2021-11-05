import { KeyPressListener } from "../utils/key-press-listener";
import { RevealingText } from "../utils/revealing-text";

export class TextMessage {

    private text: string;
    private onComplete: Function;
    private element: HTMLDivElement | null;
    private actionListener: KeyPressListener | null;
    private revelaingText!: RevealingText;

    constructor(config: TextMessageConfig) {
        this.text = config.text;
        this.onComplete = config.onComplete;
        this.element = null;
        this.actionListener = null;
    }

    init(container: any) {
        this.createElement();
        container.appendChild(this.element);
        this.revelaingText.init();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('text-message');
        this.element.innerHTML = (`
            <p class="text-message_p"></p>
            <button class="text-message_button">Next</button>
        `);

        this.revelaingText = new RevealingText({
            element: this.element.querySelector('.text-message_p'),
            text: this.text,
            speed: 50
        });

        this.element.querySelector('button')?.addEventListener('click', () => this.done());
        this.actionListener = new KeyPressListener('Enter', () => {
            this.done();
        })
    }

    done() {
        if (this.revelaingText.done) {
            this.element?.remove();
            this.actionListener?.unbind();
            this.onComplete();
        } else {
            this.revelaingText.warpToDone();
        }
    }
}

export interface TextMessageConfig {
    text: string;
    onComplete: Function;
}