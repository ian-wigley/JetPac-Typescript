import Base = require("./BaseObject");

class Particle extends Base {

    private lifeSpan: number = 20;
    private startPoint: number = 0;
    private endPoint: number = 0;
    private recordRocket: number = 0;
    private count: number = 0;
    private depth: number = 1.0;
    private radius: number;
    private alive = false;
    private fullTank: boolean = false;
    private colour: string = "";
    private colours = ["#ffcc80", "#cc6600", "#ff0000", "#990000", "#660000"];
    private animTimer: number = 0;


    constructor() {
        super();
        this.radius = 10;
    }

    public UpdateParticle(x: number, y: number, facingLeft: boolean, showParticles: boolean = true): void {
        if (showParticles) {
            if (this.m_y < this.endPoint) {
                this.animTimer += 0.1;
                if (this.animTimer > 0.4) {
                    this.m_y += 5;
                    this.radius -= 0.5;
                    console.log("y: " + this.m_y);
                    this.animTimer = 0;
                }
            }
            else if (this.m_y >= this.endPoint && !this.fullTank && !this.alive) {
                if (facingLeft) {
                    this.m_x = x + 20 + Math.floor(Math.random() * 10);
                }
                else {
                    this.m_x = x + Math.floor(Math.random() * 10);
                }
                this.alive = true;
                // Set the point where the particle started from
                this.startPoint = y + 40 + Math.floor(Math.random() * 15);
                // Set the point where the particle shall end
                this.endPoint = this.startPoint + this.lifeSpan;
                this.m_y = this.startPoint;
                // this.startPoint = y + 40 + this.lifeSpan;
                // //this.m_y = y + 40 + Math.floor(Math.random() * 10);
                // this.m_y = y + 40 + Math.floor(Math.random() * 15);
                this.radius = 10;
            }

            this.updateParticlePosition();
        }
        else {
            this.m_x = x;
            this.m_y = y + 40;
        }
    }

    private updateParticlePosition() {
        if (this.m_y == this.startPoint) {
            this.colour = this.colours[0];
        }
        if (this.m_y == this.startPoint + 25) {
            this.colour = this.colours[1];
        }
        if (this.m_y == this.startPoint + 50) {
            this.colour = this.colours[2];
        }
        if (this.m_y == this.startPoint + 75) {
            this.colour = this.colours[3];
        }
        if (this.m_y == this.startPoint + 100) {
            this.colour = this.colours[4];
        }




        // if (this.m_y == (this.startPoint)) {
        //     // Orange
        //     this.updateParticleDimensions("#ffcc80");
        // }
        // if (this.m_y == (this.startPoint - 5)) {
        //     // Dark Orange
        //     this.updateParticleDimensions("#cc6600");
        // }
        // if (this.m_y == (this.startPoint - 10)) {
        //     // Red 50%
        //     this.updateParticleDimensions("#ff0000");
        // }
        // if (this.m_y == (this.startPoint - 15)) {
        //     this.updateParticleDimensions("#990000");
        // }
        // if (this.m_y == (this.startPoint - 20)) {
        //     this.updateParticleDimensions("#660000");
        // }
    }

    // private updateParticleDimensions(colour: string): void {
    //     this.colour = colour;
    //     this.radius -= 0.5;//.75;
    // }

    public DrawParticle(ctx: CanvasRenderingContext2D, takeOff: boolean): void {
        if (takeOff) {
            // TODO .. draw the particles on take off
        }
        else {

            if (this.radius < 0) {
                this.radius = 0;
            }

            ctx.fillStyle = this.colour;
            // ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(this.m_x, this.m_y, this.radius, 0, Math.PI * 2, true);
            //ctx.arc(this.m_x, this.m_y, 20, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
}

export = Particle;