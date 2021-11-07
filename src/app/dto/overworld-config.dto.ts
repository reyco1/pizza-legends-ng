export interface OverworldConfig {
    element: HTMLElement,
    canvas: HTMLCanvasElement,
    scale: number,
}

export interface Room {
    lowerSrc: string;
    upperSrc: string;
    gameObjects: GameObjectData[];
    walls?: { [key: string]: boolean };
    cutsceneSpaces?: { [key: string]: any[] };
}

export interface GameObjectData {
    name: string;
    type: string;
    src: string;
    x: number;
    y: number;
    isPlayerControlled?: boolean;
    behaviorLoop?: Behavior[];
    talking?: Talking[];
}

export interface Behavior {
    type: string;
    direction: string;
    time?: number;
    who?: string;
    retry?: boolean;
}

export interface Talking {
    events: TalkingEvent[];
}

export interface TalkingEvent {
    type: string;
    text: string;
    faceHero?: string;
}

