import { OverworldMap } from '../components/overworld/overworld-map';
import { OverworldEvent } from '../events/overworld-event';
import { Behavior, Talking } from '../interfaces/room.interface';
import { Sprite } from './sprite';

export class GameObject {

    public isMouted: boolean;
    public isStanding: boolean;
    public x: number;
    public y: number;
    public sprite: Sprite;
    public direction: string;
    public name: string;
    public behaviorLoop: Behavior[];
    public behaviorLoopIndex: number;
    public talking: Talking[];

    constructor(config: any) {
        this.sprite = new Sprite({ gameObject: this, src: config.src });
        this.name = config.name;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || 'down'
        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
        this.talking = config.talking || [];
        this.isMouted = false;
        this.isStanding = false;
    }

    mount(map: OverworldMap) {
        this.isMouted = true;
        map.addWall(this.x, this.y);
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    async doBehaviorEvent(map: OverworldMap) {

        if (this.behaviorLoop.length === 0 || map.cutScenePlaying || this.isStanding === true) {
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.name;

        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        this.behaviorLoopIndex++;

        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        this.doBehaviorEvent(map);
    }

    update(state: { arrow: string, map: OverworldMap }) {

    }

}
