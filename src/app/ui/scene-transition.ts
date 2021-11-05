export class SceneTransition {

    private element: any;

    constructor() { }

    init(container: any, callback: Function) {
        this.createElement();
        container.appendChild(this.element);
        this.element.addEventListener('animationend', () => {
            callback();
        }, { once: true });
    }

    fadeOut() {
        this.element.classList.add('fade-out');
        this.element.addEventListener('animationend', () => {
            this.element.remove();
        }, { once: true });
    };

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('scene-transition');
    }

}