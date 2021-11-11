import { Pizzas } from "src/app/dto/pizzas";
import { BattleEvent } from "src/app/events/battle-event";
import { Combatant } from "./combatant";
import { TurnCycle } from "./turn-cycle";

export interface ActiveCombatantRef {
    team: string;
    id: string;
}

export class Battle {

    private combatants: { [key: string]: Combatant } = {};
    private turnCycle!: TurnCycle;

    public activeCombatants: ActiveCombatantRef[] = [];
    public element!: HTMLElement;

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
        ];
    }

    init(contianer: HTMLElement): void {
        this.createElement();
        contianer.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.init(this.element);
        });

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: (event: any) => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                });
            }
        });

        this.turnCycle.init();
    }

    getCombatantRef(team: string): ActiveCombatantRef {
        return this.activeCombatants.find(c => c.team === team) as ActiveCombatantRef;
    }

    getCombatant(id: string): Combatant {
        return this.combatants[id];
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

}
