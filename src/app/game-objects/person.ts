import { Behavior, GameObjectData } from '../dto/overworld-config.dto';
import { emitEvent } from '../utils/utilities';
import { GameObject } from './game-object';
import { OverworldMap } from './overworld-map';
import { PADDING } from '../dto/game-object-config.dto';
import { PERSON_STAND_COMPLETE, PERSON_WALKING_COMPLETE } from '../events/overworld-event';

export class Person extends GameObject {

    public isPlayerControlled: boolean = false;

    private movingProgressRemaining: number = 0;
    private directionUpdate: { [key: string]: any[] }

    constructor(config: GameObjectData) {
        super(config);
        this.isPlayerControlled = config.isPlayerControlled || false;
        this.movingProgressRemaining = 0;
        this.directionUpdate = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1],
        }
    }

    update(state: { arrow: string, map: OverworldMap }) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            if (!state.map.cutScenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, { type: 'walk', direction: state.arrow });
            }
            this.updateSprite();
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];

        if (property === 'x') {
            this.x += change;
        } else {
            this.y += change;
        }
        
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            emitEvent(PERSON_WALKING_COMPLETE, { whoName: this.name });
        }
    }

    startBehavior(state: { arrow: string; map: OverworldMap; }, behavior: Behavior) {
        this.direction = behavior.direction;

        if (behavior.type === 'walk') {
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior);
                }, 1000);

                return;
            }
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = PADDING;
            this.updateSprite();
        }

        if (behavior.type === 'stand') {
            this.isStanding = true;
            setTimeout(() => {
                emitEvent(PERSON_STAND_COMPLETE, { whoName: this.name });
                this.isStanding = false;
            }, behavior.time);
        }
    }

    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation('walk-' + this.direction);
            return;
        }
        this.sprite.setAnimation('idle-' + this.direction);
    }

}