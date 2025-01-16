
export class TouchController {
    constructor() {
        this.elem = document.querySelector('.mobile-controller')
        this.setPosition();

        this.elem.addEventListener('touchstart', event => {
            this.walkTouch = event.targetTouches[0];
        });

        this.elem.addEventListener('touchmove', event => {
            this.walkTouch = event.targetTouches[0];
        });

        this.elem.addEventListener('touchend', event => {
            this.walkTouch = event.targetTouches[0];
        });
    }

    setPosition() {
        this.boundingRect = this.elem.getBoundingClientRect();
        this.width = this.boundingRect.width;
        this.height = this.boundingRect.height;
        this.x = this.boundingRect.x;
        this.y = this.boundingRect.y;
        this.cx = this.x + this.width / 2;
        this.cy = this.y + this.height / 2;
    }
}