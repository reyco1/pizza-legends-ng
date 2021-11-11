import { Action } from "src/app/dto/actions";
import { Battle } from "./battle";

export class TurnCycle {

    private battle: Battle;
    private onNewEvent: Function;
    private currentTeam: string;

    constructor(config: {battle: Battle,  onNewEvent: Function}) {
        this.battle = config.battle;
        this.onNewEvent = config.onNewEvent;
        this.currentTeam = 'player';
    }

    async turn() {
        const casterId = this.battle.getCombatantRef(this.currentTeam)!.id;
        const caster = this.battle.getCombatant(casterId);

        const enemeyId = this.battle.getCombatantRef(this.currentTeam === 'player' ? 'enemy' : 'player')!.id;
        const enemy = this.battle.getCombatant(enemeyId);

        const submission = await this.onNewEvent({
            type: Action.SUBMISSION_MENU,
            caster, enemy
        });

        const resultingEvents = submission.action.success;
        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target
            };
            await this.onNewEvent(event);
        }

        this.currentTeam = this.currentTeam === 'player' ? 'enemy' : 'player';
        this.turn();
    }

    async init() {
        await this.onNewEvent({
            type: Action.TEXT_MESSAGE,
            text: 'The battle is starting!'
        })

        this.turn();
    }
}