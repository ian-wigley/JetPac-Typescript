import Base = require("TexturedObject");
import Rectangle = require("Rectangle");

class Bonus extends Base {

    private pickedUpBonus: boolean = false;
    private bonusLanded: boolean = false;
    private bonusRect: Rectangle;
    private floorRect: Rectangle;
    private ledge1Rect: Rectangle;
    private ledge2Rect: Rectangle;
    private ledge3Rect: Rectangle;

    constructor(texture: HTMLImageElement, floor: Rectangle, ledge1: Rectangle, ledge2: Rectangle, ledge3: Rectangle) {
        super(texture);
        this.m_x = Math.floor(Math.random() * 760);
        this.m_y = -30;
        this.m_width = texture.width / 5;
        this.m_height = texture.height;

        this.m_frame = Math.max(0, Math.random() * 5);
        this.floorRect = floor;
        this.ledge1Rect = ledge1;
        this.ledge2Rect = ledge2;
        this.ledge3Rect = ledge3;
    }

    public Update(): void {
        this.bonusRect = new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
        if (this.bonusRect.Intersects(this.floorRect) || this.bonusRect.Intersects(this.ledge1Rect) || this.bonusRect.Intersects(this.ledge2Rect) || this.bonusRect.Intersects(this.ledge3Rect)) {
            this.bonusLanded = true;
        }
        if (this.m_y < 472 && !this.bonusLanded && !this.pickedUpBonus) {
            this.m_y += 1;
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.m_texture, this.m_frame * this.m_width, 0, this.m_width, this.m_height, this.m_x, this.m_y, this.m_width, this.m_height);
    }

    public get Rectangle() {
        return new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
    }

    public set ResetBonus(value: boolean) {
        this.bonusLanded = value;
        this.m_frame = (this.m_frame + 1) % 5;
    }
}

export = Bonus; 