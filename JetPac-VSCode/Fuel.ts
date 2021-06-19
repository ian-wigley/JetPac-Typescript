import Base = require("./TexturedObject");
import Rectangle = require("./Rectangle");

class Fuel extends Base {

    private fuelCellLanded: boolean = false;
    private pickedUpCell: boolean = false;
    private fuelRect: Rectangle;
    private floorRect: Rectangle;
    private ledge1Rect: Rectangle;
    private ledge2Rect: Rectangle;
    private ledge3Rect: Rectangle;
    private fuelLevel: number;

    constructor(texture: HTMLImageElement, floor: Rectangle, ledge1: Rectangle, ledge2: Rectangle, ledge3: Rectangle) {
        super(texture);
        this.m_x = Math.floor(Math.random() * 760);
        this.m_y = -30;
        this.m_width = texture.width;
        this.m_height = texture.height;
        this.m_frame = 0;
        this.floorRect = floor;
        this.ledge1Rect = ledge1;
        this.ledge2Rect = ledge2;
        this.ledge3Rect = ledge3;
        this.fuelLevel = 0;
    }

    public UpdateFuelCell(x: number, y: number, collided: boolean): void {

        this.fuelRect = new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);

        if (this.fuelRect.Intersects(this.floorRect) || this.fuelRect.Intersects(this.ledge1Rect) || this.fuelRect.Intersects(this.ledge2Rect) || this.fuelRect.Intersects(this.ledge3Rect)) {
            this.fuelCellLanded = true;
        }

        if (this.m_y < 472 && !this.fuelCellLanded && !this.pickedUpCell) {
            this.m_y += 1;
        }

        if (collided == true && this.m_x != 430) {
            this.m_x = x;
            this.m_y = y + 20;
        }
        if (this.m_x == 430 && this.m_y <= 472) {
            this.m_y += 1;
            if (this.m_y >= 472) {
                this.fuelLevel += 25;
                super.Reset();
                if (this.fuelLevel < 100)
                {
                    this.fuelCellLanded = false;
                }
                else {
                    this.pickedUpCell = false;
                }
            }
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.m_texture, this.m_x, this.m_y);
    }

    public get Rectangle() {
        return new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
    }

    public get FuelLevel() {
        return this.fuelLevel;
    }

    public set ResetLevel(value: number) {
        this.fuelLevel = value;
    }
}

export = Fuel;