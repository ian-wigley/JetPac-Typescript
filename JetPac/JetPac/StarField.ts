import Base = require("BaseObject");

class StarField extends Base {

    private starLayer1X: number = Math.floor(Math.random() * 800);
    private starLayer1Y: number = Math.floor(Math.random() * 450);
    private starLayer2X: number = Math.floor(Math.random() * 800);
    private starLayer2Y: number = Math.floor(Math.random() * 500);

    constructor() {
        super();
    }

    public Update(): void {
        if (this.starLayer1X < 800) {
            this.starLayer1X++;
        }
        else {
            this.starLayer1X = Math.max(-400, Math.random() * -400);
        }

        if (this.starLayer2X < 800) {
            this.starLayer2X += 2;
        }
        else {
            this.starLayer2X = Math.max(-400, Math.random() * -400);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#565555";
        ctx.beginPath();
        ctx.arc(this.starLayer1X, this.starLayer1Y, 1, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = "#a9a8a8";
        ctx.beginPath();
        ctx.arc(this.starLayer2X, this.starLayer2Y, 1, 0, Math.PI * 2, true);
        ctx.fill();
    }
}
export = StarField;