import Base = require("TexturedObject");
import Rectangle = require("Rectangle");

class Meteor extends Base {

    private meteorCrashed: boolean = false;
    private meteorHitJetman: boolean = false;
    private meteorRect: Rectangle;
    private jetMan: Rectangle;
    private ledge1Rect: Rectangle;
    private ledge2Rect: Rectangle;
    private ledge3Rect: Rectangle;

    constructor(texture: HTMLImageElement, jetman: Rectangle, ledge1: Rectangle, ledge2: Rectangle, ledge3: Rectangle) {
        super(texture);
        this.m_x = Math.floor(Math.random() * 800);
        this.m_y = Math.floor(Math.random() * 440);
        this.m_width = 36;
        this.m_height = 35;
        this.m_frame = 0;
        this.jetMan = jetman;
        this.ledge1Rect = ledge1;
        this.ledge2Rect = ledge2;
        this.ledge3Rect = ledge3;
    }

    public Update(jetman: Rectangle): void {

        this.meteorRect = new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);

        if (this.meteorRect.Intersects(this.ledge1Rect) || this.meteorRect.Intersects(this.ledge2Rect) || this.meteorRect.Intersects(this.ledge3Rect)) {
            this.meteorCrashed = true;
        }

        if (this.meteorRect.Intersects(jetman)) {
            this.meteorHitJetman = true;
        }

        if (this.m_x > -70) {
            this.m_x--;
        }
        else {
            this.m_x = Math.max(800, Math.random() * 1200);
            this.m_y = Math.max(50, Math.random() * 400);
        }
    }

    public Draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.m_texture, this.m_frame * this.m_width, 0, this.m_width, this.m_height, this.m_x, this.m_y, this.m_width, this.m_height);
    }

    public Reset(): void {
        this.m_x = Math.max(800, Math.random() * 1200);
        this.m_y = Math.max(50, Math.random() * 400);
    }

    public get X() {
        return this.m_x;
    }

    public get Y() {
        return this.m_y;
    }

    public set Frame(value: number) {
        this.m_frame = value;
    }

    public get LedgeCollision() {
        return this.meteorCrashed;
    }

    public set LedgeCollision(value: boolean) {
        this.meteorCrashed = value;
    }


    public get JetManCollision() {
        return this.meteorHitJetman;
    }

    public set JetManCollision(value: boolean) {
        this.meteorHitJetman = value;
    }

    public get Rectangle() {
        return new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
    }
}

export = Meteor; 