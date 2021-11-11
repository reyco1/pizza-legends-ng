import { Action } from "rxjs/internal/scheduler/Action";
import { Actions } from "src/app/dto/actions";
import { Combatant } from "./combatant";

export class SubmissionMenu {

    private caster: Combatant;
    private enemy: Combatant;
    private onComplete: Function;

    constructor(config: any) { 
        this.caster = config.caster;
        this.onComplete = config.onComplete;
        this.enemy = config.enemy;
    }

    init(container: any) {
        this.decide();
     }

    decide() {
        this.onComplete({
            action: Actions[ this.caster.getConfig().actions[0] as keyof typeof Actions ],
            target: this.enemy
        });   
    }

}