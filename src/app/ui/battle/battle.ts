import { Combatant } from "./combatant";

export class Battle {

    private element!: HTMLElement;
    private combatants: { [key: string]: Combatant } = {};

    constructor(config: any) {

        this.combatants.player1 = new Combatant({
            hp: 50,
            maxHp: 50,
            xp: 0,
            level: 1,
            status: null
        }, this);

    }

    private createElement(): void {
        this.element = document.createElement('div');
        this.element.classList.add('battle');
        this.element.innerHTML = `
        <div class="battle-hero">
            <img src="${'assets/images/characters/people/hero.png'}" alt="hero" />
        </div>
        <div class="battle-enemy">
            <img src="${'assets/images/characters/people/npc3.png'}" alt="enemey" />
        </div>
        `;
    }

    public init(contianer: HTMLElement): void {
        this.createElement();
        contianer.appendChild(this.element);
    }

}