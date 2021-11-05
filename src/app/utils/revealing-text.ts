export class RevealingText {

    private element!: any;
    private text: string;
    private speed: number;
    private timeout: any;

    public done: boolean = false;

    constructor(config: RevealingTextConfig) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed;
    }

    init() {
        let characters: any = [];
        this.text.split('').forEach(character => {
            let span = document.createElement('span');
            span.textContent = character;
            this.element.appendChild(span);
            characters.push({
                span,
                delayAfter: character === ' ' ? 0 : this.speed
            });
        });
        this.revealOneCharacter(characters);
    }

    revealOneCharacter(characters: any[]) {
        const next = characters.splice(0, 1)[0];
        next.span.classList.add('revealed');
        if (characters.length > 0) {
            this.timeout = setTimeout(() => this.revealOneCharacter(characters), next.delayAfter);
        } else {
            this.done = true;
        }
    }

    warpToDone() {
        clearTimeout(this.timeout);
        this.done = true;
        this.element.querySelectorAll('span').forEach((span: any) => {
            span.classList.add('revealed');
        });
    }

}

export interface RevealingTextConfig {
    text: string;
    element: any;
    speed: number;
}

