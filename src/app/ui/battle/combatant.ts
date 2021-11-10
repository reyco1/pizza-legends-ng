import { Battle } from "./battle";
import { CombatantConfig } from "./combatant.config";

export class Combatant {

    private battle: Battle;
    private config: CombatantConfig;

    private hudElement!: HTMLDivElement;
    private hpFills!: NodeListOf<SVGRectElement>;
    private xpFills!: NodeListOf<SVGRectElement>;
    private pizzaElement!: HTMLImageElement;

    constructor(config: CombatantConfig, battle: Battle) {
        this.battle = battle;
        this.config = config;
    }

    public init(container: any) {
        this.createHudElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.pizzaElement);
        this.update();
    }

    public createHudElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("combatant");
        this.hudElement.setAttribute("data-combatant", this.config.id);
        this.hudElement.setAttribute("data-team", this.config.team);
        this.hudElement.innerHTML = `
            <p class="combatant-name">${this.config.name}</p>
            <p class="combatant-level"></p>
            <div class="combatant-character-crop">
                <img class="combatant-character" src="${this.config.src}" alt="${this.config.name}" >
            </div>
            <img class="combatant-type" src="${this.config.icon}" alt="${this.config.type}" >
            <svg class="combatant-life-container" viewBox="0 0 26 3">
                <rect x="0" y="0" width="0%" height=1 fill="#82ff71" />
                <rect x="0" y="1" width="0%" height=2 fill="#3ef126" />
            </svg>
            <svg class="combatant-xp-container" viewBox="0 0 26 2">
                <rect x="0" y="0" width="0%" height=1 fill="#ffd76a" />
                <rect x="0" y="1" width="0%" height=1 fill="#ffc934" />
            </svg>
            <p class="combatant-status"></p>
        `;

        this.pizzaElement = document.createElement("img");
        this.pizzaElement.classList.add("pizza");
        this.pizzaElement.setAttribute("src", this.config.src);
        this.pizzaElement.setAttribute("alt", this.config.name);
        this.pizzaElement.setAttribute("data-team", this.config.team);

        this.hpFills = this.hudElement.querySelector(".combatant-life-container")!.querySelectorAll("rect") as NodeListOf<SVGRectElement>;
        this.xpFills = this.hudElement.querySelector(".combatant-xp-container")!.querySelectorAll("rect") as NodeListOf<SVGRectElement>;
    }

    get hpPercent() {
        const percent = this.config.hp / this.config.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent() {
        const percent = this.config.xp / this.config.maxXp * 100;
        return percent > 0 ? percent : 0;
    }

    get isActive(): boolean {
        return this.battle.activeCombatants.find(resp => resp.id === this.config.id && resp.team === this.config.team) !== undefined;
    }

    private update(changes?: any): void {
        if (changes) {
            Object.assign(this.config, changes);
        }

        this.hudElement.setAttribute("data-active", this.isActive ? "true" : "false");
        this.pizzaElement.setAttribute("data-active", this.isActive ? "true" : "false");

        this.hudElement.querySelector(".combatant-level")!.innerHTML = this.config.level.toString();

        this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`);
    }


}