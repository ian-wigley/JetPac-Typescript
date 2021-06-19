import Base = require("./TexturedObject");

class Particle extends Base {

    lifeSpan: number = 20;
    record: number = 0;
    recordRocket: number = 0;
    count: number = 0;
    depth: number = 1.0;
    scale_x: number;
    scale_y: number;
    fullTank: boolean = false;

    constructor(texture: HTMLImageElement) {
        super(texture);
        this.m_width = texture.width;
        this.m_height = texture.height;
        this.m_frame = 0;
        this.scale_x = texture.width;
        this.scale_y = texture.height;
    }

    public UpdateParticle(x: number, y: number, facingLeft: boolean, showParticles: boolean): void {
        if (showParticles == true) {
            if (this.m_y < this.record) {
                this.m_y++;
            }
            else if (this.m_y >= this.record && this.fullTank == false) {
                if (facingLeft == true) {
                    this.m_x = x + 20 + Math.floor(Math.random() * 10);
                }
                else {
                    this.m_x = x + Math.floor(Math.random() * 10);
                }

                this.record = y + 40 + this.lifeSpan;
                this.m_y = y + 40 + Math.floor(Math.random() * 10);
                this.scale_x = this.m_width;
                this.scale_y = this.m_height;
            }

            if (this.m_y == (this.record - 20)) {
                this.count = 0;
                this.depth = 1.0;
                this.scale_x -= 1.75;
                this.scale_y -= 1.75;
            }
            if (this.m_y == (this.record - 15)) {
                this.count = 1;
                this.depth = 0.9;
                this.scale_x -= 1.0;
                this.scale_y -= 1.75;
            }
            if (this.m_y == (this.record - 10)) {
                this.count = 2;
                this.depth = 0.8;
                this.scale_x -= 1.75;
                this.scale_y -= 1.75;
            }
            if (this.m_y == (this.record - 5)) {
                this.count = 3;
                this.depth = 0.7;
                this.scale_x -= 1.75;
                this.scale_y -= 1.75;
            }
            if (this.m_y == (this.record)) {
                this.count = 4;
                this.depth = 0.45;
                this.scale_x -= 1.75;
                this.scale_y -= 1.75;
            }
        }
        else {
            this.m_x = x;
            this.m_y = y + 40;
        }
    }

    public DrawParticle(ctx: CanvasRenderingContext2D, takeOff: boolean): void {
        if (takeOff) { // TODO include the particle drawing.
        }
        else {
            ctx.drawImage(this.m_texture, 0, 0, this.m_width, this.m_height, this.m_x, this.m_y, this.scale_x, this.scale_y);

            if (this.scale_x < 0) {
                this.scale_x = 0;
            }

            ctx.fillStyle = "#FF0000";
            ctx.beginPath();
            ctx.arc(this.m_x, this.m_y, this.scale_x, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
}

export = Particle;