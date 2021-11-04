export class MouseListener {

    private mouseDownFunction: any;
    private target: any;

    constructor(target: any, callback: Function) {
        this.target = target ? target : document;
        this.mouseDownFunction = function (event: any) {
            callback(event);
        }
        this.target.addEventListener('mousedown', this.mouseDownFunction);
    }

    unbind() {
        this.target.removeEventListener('mousedown', this.mouseDownFunction);
    }

}