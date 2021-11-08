import { oppositeDirection } from '../utils/utilities';
import { OverworldMap } from '../game-objects/overworld-map';
import { Person } from '../game-objects/person';
import { SceneTransition } from '../ui/scene-transition';
import { TextMessage } from '../ui/text-message';

export const PERSON_WALKING_COMPLETE: string = 'person-walk-complete';
export const PERSON_STAND_COMPLETE: string = 'person-stand-complete';

export class OverworldEvent {

    private map: OverworldMap;
    private event: any;

    constructor(config: { map: OverworldMap, event: any }) {
        this.map = config.map;
        this.event = config.event;
    }

    init() {
        return new Promise(resolve => {
            const eventType: string = this.event.type;
            this[eventType as keyof OverworldEvent](resolve)
        });
    }

    changeMap(resolve: any) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector('.game-container'), () => {
            const mapName = this.event.map;
            this.map.overworld?.startMap(mapName)
            resolve();

            sceneTransition.fadeOut()
        });
    }

    textMessage(resolve: any) {

        if (this.event.faceHero) {
            const npc: Person = this.map.gameObjects.find(obj => obj.name === this.event.faceHero) as Person;
            const hero: Person = this.map.gameObjects.find(obj => obj.name === 'hero') as Person;
            npc.direction = oppositeDirection(hero.direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        });

        message.init(document.querySelector('.game-container'));
    }

    stand(resolve: any) {
        const who: Person = this.map.gameObjects.find(obj => obj.name === this.event.who) as Person;
        who.startBehavior({ map: this.map, arrow: '' }, { type: 'stand', direction: this.event.direction, time: this.event.time });

        const completeHandler = (evt: any) => {
            if (evt.detail.whoName === this.event.who) {
                document.removeEventListener(PERSON_STAND_COMPLETE, completeHandler);
                resolve();
            }
        }

        document.addEventListener(PERSON_STAND_COMPLETE, completeHandler);
    }

    walk(resolve: any) {
        const who: Person = this.map.gameObjects.find(obj => obj.name === this.event.who) as Person;
        who.startBehavior({ map: this.map, arrow: '' }, { type: 'walk', direction: this.event.direction, retry: true });

        const completeHandler = (evt: any) => {
            if (evt.detail.whoName === this.event.who) {
                document.removeEventListener(PERSON_WALKING_COMPLETE, completeHandler);
                resolve();
            }
        }

        document.addEventListener(PERSON_WALKING_COMPLETE, completeHandler);
    }
}