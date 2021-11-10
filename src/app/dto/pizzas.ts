export enum PizzaType {
    Normal = 'normal',
    Spicy = 'spicy',
    Veggie = 'veggie',
    Fungi = 'fungi',
    Chilli = 'chilli',
}

export const Pizzas = {
    's001': {
        name: 'Slice Samurai',
        type: PizzaType.Spicy,
        src: 'assets/images/characters/pizzas/s001.png',
        icon: 'assets/images/icons/spicy.png'
    },
    'v001': {
        name: 'Calle Me Kale',
        type: PizzaType.Veggie,
        src: 'assets/images/characters/pizzas/v001.png',
        icon: 'assets/images/icons/veggie.png'
    },
    'f001': {
        name: 'Portabello Express',
        type: PizzaType.Fungi,
        src: 'assets/images/characters/pizzas/f001.png',
        icon: 'assets/images/icons/fungi.png'
    },
}