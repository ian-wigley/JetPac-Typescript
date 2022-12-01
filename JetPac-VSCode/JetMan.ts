import Base = require("./TexturedObject");
import Rectangle = require("./Rectangle");

class JetMan extends Base {

    private onFloor: boolean = false;
    private onGround: boolean = false;
    private facingLeft: boolean = false;
    private animate: boolean = false;
    private animTimer: number = 0;

    constructor(texture: HTMLImageElement, x: number, y: number) {
        super(texture);
        this.m_x = x;
        this.m_y = y;
        this.m_width = 36;
        this.m_height = 52;
    }

    public Update(controls): void {
        this.moveJetmanUp(controls);
        this.moveJetManDown(controls);
        this.moveJetmanLeft(controls);
        this.moveJetManRight(controls);
        this.checkBounds();
    }

    private moveJetmanUp(controls) {
        if (controls.up) {
            this.m_y -= 2;
            this.onGround = false;
            this.animate = false;
            this.onFloor = false;
            this.m_frame = 0;
        } else {
            this.m_y += 1;
        }
    }

    private moveJetManDown(controls) {
        if (controls.down && !this.onGround && !this.onFloor) {
            this.m_y += 2;
        }
    }

    private moveJetmanLeft(controls) {
        if (controls.left) {
            this.m_x -= 2;
            this.facingLeft = true;

            if (this.onGround || this.onFloor) {
                this.animTimer += 0.1;
                if (this.animTimer > 0.4) {
                    this.m_frame = this.m_frame % 4 + 1;
                    this.animTimer = 0;
                }
            }
        }
    }

    private moveJetManRight(controls) {
        if (controls.right) {
            this.m_x += 2;
            this.facingLeft = false;
            if (this.onGround || this.onFloor) {
                this.animTimer += 0.1;
                if (this.animTimer > 0.4) {
                    this.m_frame = this.m_frame % 4 + 1;
                    this.animTimer = 0;
                }
            }
        }
    }

    private checkBounds() {
        if (this.m_y <= 50) {
            this.m_y = 50;
        }

        if (this.m_y >= 550) {
            this.m_y = 550;
        }

        if (this.m_x <= 0) {
            this.m_x = 0;
        }
        if (this.m_x >= 750) {
            this.m_x = 750;
        }
    }

    public Draw(ctx): void {
        ctx.beginPath();
        ctx.rect(this.m_x, this.m_y, this.m_width, this.m_height);
        ctx.fillStyle = "blue";
        ctx.fill();

        if (!this.facingLeft) {
            ctx.drawImage(this.m_texture, this.m_frame * this.m_width, 0, this.m_width, this.m_height, this.m_x, this.m_y, this.m_width, this.m_height);
        }
        else {
            ctx.drawImage(this.m_texture, this.m_frame * this.m_width, this.m_height, this.m_width, this.m_height, this.m_x, this.m_y, this.m_width, this.m_height);
        }
    }

    public resetPosition(): void {
        this.m_x = 150;
        this.m_y = 300;
    }

    public get x() {
        return this.m_x;
    }

    public set x(value) {
        this.m_x = value;
    }

    public get y() {
        return this.m_y;
    }

    public set y(value) {
        this.m_y = value;
    }

    public set stoodOnFloor(value) {
        this.onFloor = value;
    }

    public get stoodOnFloor() {
        return this.onFloor;
    }

    public set stoodOnLedge(value) {
        this.onGround = value;
    }

    public get stoodOnLedge() {
        return this.onGround;
    }

    public get rectangle() {
        return new Rectangle(this.m_x, this.m_y, this.m_width, this.m_height);
    }

    public get frame() {
        return this.m_frame;
    }

    public set frame(value) {
        this.m_frame = value;
    }

    public get animation() {
        return this.animate;
    }

    public set animation(value) {
        this.animate = value;
    }

    public get facing() {
        return this.facingLeft;
    }

}

export = JetMan;