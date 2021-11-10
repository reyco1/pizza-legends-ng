import { Pizzas } from "src/app/dto/pizzas";
import { Combatant } from "./combatant";

export class Battle {

    private element!: HTMLElement;
    private combatants: { [key: string]: Combatant } = {};

    public activeCombatants: { team: string; id: string; }[] = [];

    constructor(config: any) {

        this.combatants.player1 = new Combatant({
            ...Pizzas.s001,
            id: 'player1',
            team: 'player',
            hp: 50,
            maxHp: 50,
            maxXp: 100,
            xp: 0,
            level: 1,
            status: null
        }, this);

        this.combatants.enemy1 = new Combatant({
            ...Pizzas.v001,
            team: 'enemy',
            id: 'enemy1',
            hp: 50,
            maxHp: 50,
            maxXp: 100,
            xp: 0,
            level: 1,
            status: null
        }, this);

        this.combatants.enemy2 = new Combatant({
            ...Pizzas.f001,
            team: 'enemy',
            id: 'enemy2',
            hp: 50,
            maxHp: 50,
            maxXp: 100,
            xp: 0,
            level: 1,
            status: null
        }, this);

        this.activeCombatants = [
            { team: 'player', id: 'player1' },
            { team: 'enemy', id: 'enemy1' }
        ]

    }

    private createElement(): void {
        this.element = document.createElement('div');
        this.element.classList.add('battle');
        this.element.innerHTML = `
        <div class="battle-hero">
            <img src="${'assets/images/characters/people/hero.png'}" alt="hero" />
        </div>
        <div class="battle-enemy">
            <img src="${'assets/images/characters/people/npc3.png'}" alt="enemy" />
        </div>
        `;
    }

    public init(contianer: HTMLElement): void {
        this.createElement();
        contianer.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.init(this.element);
        });
    }

}
