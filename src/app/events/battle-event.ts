import { Battle } from "../ui/battle/battle";
import { BattleAnimations } from "../ui/battle/battle-animations";
import { SubmissionMenu } from "../ui/battle/submission-menu";
import { TextMessage } from "../ui/text-message";
import { wait } from "../utils/utilities";

export class BattleEvent {

    event: any;
    battle: Battle;

    constructor(event: any, battle: Battle) {
        this.event = event;
        this.battle = battle;
    }

    init(resolve: Function) {
        this[this.event.type as keyof BattleEvent](resolve);
    }

    submissionMenu(resolve: Function) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: (submission: any) => {
                resolve(submission)
            }
        });
        menu.init(this.battle.element);
    }

    async stateChange(resolve: Function) {
        const { caster, target, damage } = this.event

        if (damage) {
            target.update({ hp: target.config.hp - damage })
            target.pizzaElement.classList.add('battle-damage-blink');
        }

        await wait(600);

        target.pizzaElement.classList.remove('battle-damage-blink');

        resolve();
    }

    textMessage(resolve: Function) {

        console.log(this.event);

        const text = this.event.text
            .replace('{CASTER}', this.event.caster?.config.name)
            .replace('{TARGET}', this.event.target?.config.name)
            .replace('{ACTION}', this.event.action?.name);

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        });
        message.init(this.battle.element)
    }

    animation(resolve: Function) {
        const fn = BattleAnimations[this.event.animation as keyof typeof BattleAnimations];
        fn(this.event, resolve);
    }
}