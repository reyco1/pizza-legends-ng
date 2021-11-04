export class KeyPressListener {

    private keyDownFunction: any;
    private keyUpFunction: any;

    constructor(keyCode: string, callback: Function) {
        let keySafe = true;
        this.keyDownFunction = function (event: any) {
            // console.log('event.code ', event.code );
            if (event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        }
        this.keyUpFunction = function (event: any) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        }
        document.addEventListener('keydown', this.keyDownFunction);
        document.addEventListener('keyup', this.keyUpFunction);
    }

    unbind() {
        document.removeEventListener('keydown', this.keyDownFunction);
        document.removeEventListener('keyup', this.keyUpFunction);
    }

}