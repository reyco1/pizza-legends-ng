import { wait } from 'src/app/utils/utilities';
import { Combatant } from './combatant';

export const BattleAnimations = {

    async spin(event: {caster: Combatant}, onComplete: Function) {
        const element = event.caster.pizzaElement;
        const animationClassName = event.caster.getConfig().team === 'player' ? 'battle-spin-right' : 'battle-spin-left';
        element.classList.add(animationClassName);

        // remove class when animation is compelte
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClassName);
        }, {once: true});

        await wait(100);
        onComplete();
    }

}