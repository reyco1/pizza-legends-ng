export enum Action {
    TEXT_MESSAGE = 'textMessage',
    ANIMATION = 'animation',
    STATE_CHANGE = 'stateChange',
    SUBMISSION_MENU = 'submissionMenu'
}

export const Actions = {
    damage1: {
        name: 'whomp!',
        type: 'normal',
        success: [
            { type: Action.TEXT_MESSAGE, text: '{CASTER} uses {ACTION}!' },
            { type: Action.ANIMATION, animation: 'spin' },
            { type: Action.STATE_CHANGE, damage: 10 }
        ]
    }
}