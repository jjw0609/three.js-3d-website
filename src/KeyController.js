export class KeyController {
    constructor() {
        this.keys = [];

        window.addEventListener('keydown', event => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', event => {
           delete this.keys[event.code];
        });
    }
}