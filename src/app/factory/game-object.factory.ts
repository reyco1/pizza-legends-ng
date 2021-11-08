import { GameObject } from "../game-objects/game-object";
import { Person } from "../game-objects/person";
import { GameObjectData, Behavior } from "../interfaces/room.interface";
import { asTileCoord, asGridCoord, withGrid } from "../utils/utilities";

export class GameObjectFactory {

    private static gameObjects: { name: string, gameObject: GameObject }[] = [];

    public static createGameObject(gameObjectData: GameObjectData): GameObject | Person {
        let gameObjectDto = GameObjectFactory.gameObjects.find(obj => obj.name === gameObjectData.name);
        gameObjectData.x = withGrid(gameObjectData.x);
        gameObjectData.y = withGrid(gameObjectData.y);

        if (gameObjectDto) {
            return gameObjectDto.gameObject;
        } else {
            const ObjectTypeClass = gameObjectData.type === 'person' ? Person : GameObject;
            const gameObject = new ObjectTypeClass(gameObjectData)
            return gameObject;
        }
    }

    public static createGameObjects(gameObjectDataArr: GameObjectData[]): GameObject[] {
        const gameObjects = [];
        for (let i = 0; i < gameObjectDataArr.length; i++) {
            const gameObjectData = gameObjectDataArr[i];
            gameObjects.push(GameObjectFactory.createGameObject(gameObjectData));
        }
        return gameObjects;
    }

    public static parseWalls(walls: { [key: string]: boolean }, asTileCoords: boolean = false): { [key: string]: boolean } {
        for (const key in walls) {
            if (Object.prototype.hasOwnProperty.call(walls, key)) {
                walls[asTileCoords ? asTileCoord(key) : asGridCoord(key)] = true;
                delete walls[key];
            }
        }
        return walls;
    }

    public static parseCutsceneSpaces(cutsceneSpaces: { [key: string]: Behavior[] }): { [key: string]: Behavior[] } {
        for (const key in cutsceneSpaces) {
            if (Object.prototype.hasOwnProperty.call(cutsceneSpaces, key)) {
                cutsceneSpaces[asGridCoord(key)] = cutsceneSpaces[key];
                delete cutsceneSpaces[key];
            }
        }
        return cutsceneSpaces;
    }

}
