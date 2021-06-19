import Base = require("./TexturedObject");
import Rectangle = require("./Rectangle");

class Bullet extends Base {

    m_left: boolean;
    m_offscreen: boolean = false;

    constructor(texture: HTMLImageElement, x: number, y: number, direction: boolean) {
        super(texture);
        this.m_x = x;
        this.m_y = y + 24;
        this.m_left = direction;
    }

    public Update(): void {
        if (this.m_x < 800 && !this.m_left) {
            this.m_x += 3;
        }
        else if (this.m_x > -40) {
            this.m_x -= 3;
        }
        if (this.m_x >= 800 || this.m_x <= -40) {
            this.m_offscreen = true;
        }
    }

    public Draw(ctx): void {
        ctx.drawImage(this.m_texture, this.m_x, this.m_y);
    }

    public get Offscreen() {
        return this.m_offscreen;
    }

    public get Rectangle() {
        return new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
    }
}

export = Bullet;