import Bonus = require("./Bonus");
import Bullet = require("./Bullet");
import Controls = require("./Input");
import Explosion = require("./Explosion");
import Fuel = require("./Fuel");
import Meteorite = require("./Meteor");
import Particle = require("./Particle");
import Rectangle = require("./Rectangle");
import Starfield = require("./StarField");

class JetPac {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private width: number = 800;
    private height: number = 600;

    private menuBackground: HTMLImageElement;
    private gameSprites: HTMLImageElement;
    private rocketSprites: HTMLImageElement;
    private floor: HTMLImageElement;
    private ledge1: HTMLImageElement;
    private ledge2: HTMLImageElement;
    private explosion: HTMLImageElement;
    private alien: HTMLImageElement;
    private bullet: HTMLImageElement;
    private particle: HTMLImageElement;
    private fuel: HTMLImageElement;
    private bonus: HTMLImageElement;

    private firedSound: HTMLAudioElement;
    private collisionSound: HTMLAudioElement;
    private destroyedSound: HTMLAudioElement;

    private meteors: Array<Meteorite>;
    private stars: Array<Starfield>;
    private part: Array<Particle>;
    private explosionList: Array<Explosion>;
    private bullets: Array<Bullet>;

    private fuelCell: Fuel;
    private extras: Bonus;

    private score: number = 0;
    private lives: number = 3;
    private currentFrame: number = 0;
    private spriteWidth: number = 36;
    private spriteHeight: number = 52;

    private fuelLevel: number = 0;

    private x: number = 150;
    private y: number = 300;

    private facingLeft: boolean = false;
    private gameOn: boolean = false;
    private tripSwitch: boolean = false;

    private animTimer: number = 0;

    private rocketWidth: number = 75;
    private rocketHeight: number = 61;
    private rocket1X: number = 422;
    private rocket1Y: number = 440;
    private rocketFrame1: number = 0;

    private rocket2X: number = 110;
    private rocket2Y: number = 140;
    private rocketFrame2: number = 4;

    private rocket3X: number = 510;
    private rocket3Y: number = 177;
    private rocketFrame3: number = 8;

    private floorX: number = 0;
    private floorY: number = 500;
    private level: number = 16;
    private meteor: number = 0;
    public ledge1X: number = 60;
    public ledge1Y: number = 200;
    public ledge2X: number = 310;
    public ledge2Y: number = 265;
    public ledge3X: number = 490;
    public ledge3Y: number = 136;

    private onFloor: boolean = false;
    private onGround: boolean = false;
    private showParticles: boolean = false;
    private pickedUpFirstPiece: boolean = false;
    private deliveredFirstPiece: boolean = false;
    private pickedUpSecondPiece: boolean = false;
    private deliveredSecondPiece: boolean = false;
    private lowerFirstPiece: boolean = false;
    private rocketAssembled: boolean = false;
    private fullTank: boolean = false;
 //   private alienReset: boolean = false;
    private getNextPiece: boolean = false;
    private fired: boolean = false;

    private floorRect: Rectangle;
    private ledge1Rect: Rectangle;
    private ledge2Rect: Rectangle;
    private ledge3Rect: Rectangle;

    private m_ctrl: Controls = new Controls();

    constructor() {
    }

    private rect(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public Run(): void {
        this.Initialize();
    }

    private Initialize(): void {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.menuBackground = <HTMLImageElement>document.getElementById("loading");
        this.gameSprites = <HTMLImageElement>document.getElementById("sprites");
        this.rocketSprites = <HTMLImageElement>document.getElementById("rocket_sprites");
        this.floor = <HTMLImageElement>document.getElementById("floor");
        this.ledge1 = <HTMLImageElement>document.getElementById("ledge1");
        this.ledge2 = <HTMLImageElement>document.getElementById("ledge2");
        this.explosion = <HTMLImageElement>document.getElementById("explosion");
        this.alien = <HTMLImageElement>document.getElementById("meteor");
        this.bullet = <HTMLImageElement>document.getElementById("bullet");
        this.particle = <HTMLImageElement>document.getElementById("particle");
        this.fuel = <HTMLImageElement>document.getElementById("fuel_cell");
        this.bonus = <HTMLImageElement>document.getElementById("bonus");

        this.firedSound = <HTMLAudioElement>document.getElementById("fired");
        this.collisionSound = <HTMLAudioElement>document.getElementById("collision");
        this.destroyedSound = <HTMLAudioElement>document.getElementById("destroyed");

        this.floorRect = new Rectangle(this.floorX, this.floorY, this.floor.width, this.floor.height);
        this.ledge1Rect = new Rectangle(this.ledge1X, this.ledge1Y, this.ledge1.width, this.ledge1.height);
        this.ledge2Rect = new Rectangle(this.ledge2X, this.ledge2Y, this.ledge2.width, this.ledge2.height);
        this.ledge3Rect = new Rectangle(this.ledge3X, this.ledge3Y, this.ledge1.width, this.ledge1.height);

        this.meteors = new Array<Meteorite>(10);
        for (var i = 0; i < 10; i++) {
            var m: Meteorite = new Meteorite(this.alien, this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect);
            this.meteors[i] = m;
        }

        this.stars = new Array<Starfield>();
        for (var j = 0; j < 40; j++) {
            this.stars.push(new Starfield());
        }

        this.part = new Array<Particle>();
        for (var k = 0; k < 40; k++) {
            this.part.push(new Particle(this.particle));
        }

        this.fuelCell = new Fuel(this.fuel, this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect);
        this.extras = new Bonus(this.bonus, this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect);

        this.bullets = new Array<Bullet>();

        this.explosionList = new Array<Explosion>();

        this.AddHitListener(this.canvas);
        this.Update()
    }

    private AddHitListener(element: HTMLElement) {
        window.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });

        window.addEventListener("keyup", (event) => {
            this.onKeyUp(event);
            return null;
        });
    }

    onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardPress(event, false);
    }

    onKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardRelease(event, false);
    }

    onKeyboardPress(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                if (!this.fired) {
                    this.m_ctrl.fire = true;
                    this.fired = true;
                }
                break;
            case 37:
                this.m_ctrl.left = true;
                break;
            case 38:
                this.m_ctrl.up = true;
                break;
            case 39:
                this.m_ctrl.right = true;
                break;
            case 40:
                this.m_ctrl.down = true;
                break;
            case 83:
                if (!this.gameOn) {
                    this.gameOn = true;
                    this.ResetGame();
                }
                break;
        }
    }

    onKeyboardRelease(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                this.m_ctrl.fire = false;
                this.fired = false;
                break;
            case 37:
                this.m_ctrl.left = false;
                break;
            case 38:
                this.m_ctrl.up = false;
                break;
            case 39:
                this.m_ctrl.right = false;
                break;
            case 40:
                this.m_ctrl.down = false;
                break;
            default:
                this.m_ctrl.fire = false;
                break;
        }
    }

    private Update(): void {

        if (this.gameOn) {

            if (this.m_ctrl.fire) {
                var b: Bullet = new Bullet(this.bullet, this.x, this.y, this.facingLeft);
                this.bullets.push(b);
                this.m_ctrl.fire = false;
                this.firedSound.play();
            }

            if (this.m_ctrl.up) {
                this.y -= 2;
                this.onGround = false;
                this.tripSwitch = false;
                this.onFloor = false;
                this.currentFrame = 0;
                this.showParticles = true;
            } else {
                this.y += 1;
                this.showParticles = false;
            }

            if (this.m_ctrl.down && !this.onGround && !this.onFloor) {
                this.y += 2;
            }

            if (this.m_ctrl.left) {
                this.x -= 2;
                this.facingLeft = true;

                if (this.onGround || this.onFloor) {
                    this.animTimer += 0.1;
                    if (this.animTimer > 0.4) {
                        this.currentFrame = this.currentFrame % 4 + 1;
                        this.animTimer = 0;
                    }
                }
            }

            if (this.m_ctrl.right) {
                this.x += 2;
                this.facingLeft = false;
                if (this.onGround || this.onFloor) {
                    this.animTimer += 0.1;
                    if (this.animTimer > 0.4) {
                        this.currentFrame = this.currentFrame % 4 + 1;
                        this.animTimer = 0;
                    }
                }
            }

            if (this.y <= 50) {
                this.y = 50;
            }

            if (this.y >= 550) {
                this.y = 550;
            }

            if (this.x <= 0) {
                this.x = 0;
            }
            if (this.x >= 750) {
                this.x = 750;
            }

            var mainSpritesRect: Rectangle = new Rectangle(this.x, this.y, this.spriteWidth, this.spriteHeight);

            var collectRocketRect2: Rectangle = new Rectangle(this.rocket2X, this.rocket2Y, this.rocketWidth, this.rocketHeight);
            var collectRocketRect3: Rectangle = new Rectangle(this.rocket3X, this.rocket3Y, this.rocketWidth, this.rocketHeight);

            this.Rocket();

            for (var j = 0; j < 40; j++) {
                this.part[j].UpdateParticle(this.x, this.y, this.facingLeft, this.showParticles);
            }

            for (var j = 0; j < this.stars.length; j++) {
                this.stars[j].Update();
            }

            for (var j = 0; j < this.meteors.length; j++) {
                this.meteors[j].Update(mainSpritesRect);
                if (this.meteors[j].LedgeCollision) {
                    this.explosionList.push(new Explosion(this.explosion, this.meteors[j].X, this.meteors[j].Y));
                    this.destroyedSound.play();
                    this.meteors[j].Reset();
                    this.meteors[j].LedgeCollision = false;
                }


                if (this.meteors[j].JetManCollision) {
                    this.lives -= 1;
                    this.meteors[j].Reset();
                    this.meteors[j].JetManCollision = false;
                    this.collisionSound.play();
                }

                var temp = [];
                for (var i = 0; i < this.bullets.length; i++) {
                    if (this.bullets[i].Rectangle.Intersects(this.meteors[j].Rectangle)) {
                        this.destroyedSound.play();
                        this.explosionList.push(new Explosion(this.explosion, this.meteors[j].X, this.meteors[j].Y));
                        this.meteors[j].Reset();
                        this.score += 100;
                    }
                    else {
                        temp.push(this.bullets[i]);
                    }
                }
                this.bullets = [];
                this.bullets = temp;
            }

            temp = [];
            for (var j = 0; j < this.explosionList.length; j++) {
                if (!this.explosionList[j].AnimationComplete) {
                    this.explosionList[j].Update();
                    temp.push(this.explosionList[j]);
                }
            }
            this.explosionList = [];
            this.explosionList = temp;

            temp = [];
            for (var i = 0; i < this.bullets.length; i++) {
                if (!this.bullets[i].Offscreen) {
                    this.bullets[i].Update();
                    temp.push(this.bullets[i]);
                }
            }
            this.bullets = [];
            this.bullets = temp;

            if (this.rocketAssembled) {

                if (mainSpritesRect.Intersects(this.fuelCell.Rectangle)) {
                    var collided = true;
                }

                this.fuelCell.UpdateFuelCell(this.x, this.y, collided);
                this.fuelLevel = this.fuelCell.FuelLevel;
                if (this.fuelLevel == 100) {
                    this.fullTank = true;
                }

                this.extras.Update();
            }

            if (mainSpritesRect.Intersects(this.floorRect)) {
                this.onGround = true;
                this.y -= 1;
                if (!this.tripSwitch) {
                    this.currentFrame += 1;
                    this.tripSwitch = true;
                }
            }

            if (mainSpritesRect.Intersects(this.ledge1Rect)) {
                if (mainSpritesRect.Height - 3 == this.ledge1Rect.Top ||
                    mainSpritesRect.Height - 2 == this.ledge1Rect.Top ||
                    mainSpritesRect.Height - 1 == this.ledge1Rect.Top ||
                    mainSpritesRect.Height == this.ledge1Rect.Top) {
                    this.onGround = true;
                    this.y -= 1;
                    if (!this.tripSwitch) {
                        this.currentFrame += 1;
                        this.tripSwitch = true;
                    }
                }
                if (mainSpritesRect.Top + 1 <= this.ledge1Rect.Height && mainSpritesRect.Top + 1 >= this.ledge1Rect.Top) {
                    this.y = this.ledge1Rect.Height + 1;
                }
                if (mainSpritesRect.Width - 2 == this.ledge1Rect.Left) {
                    this.x -= 2;
                }
                if (mainSpritesRect.Left + 1 == this.ledge1Rect.Width) {
                    this.x += 2;
                }
            }

            if (mainSpritesRect.Intersects(this.ledge2Rect)) {
                if (mainSpritesRect.Height - 3 == this.ledge2Rect.Top ||
                    mainSpritesRect.Height - 2 == this.ledge2Rect.Top ||
                    mainSpritesRect.Height - 1 == this.ledge2Rect.Top ||
                    mainSpritesRect.Height == this.ledge2Rect.Top) {
                    this.onGround = true;
                    this.y -= 1;
                    if (!this.tripSwitch) {
                        this.currentFrame += 1;
                        this.tripSwitch = true;
                    }
                }
                if (mainSpritesRect.Top + 1 <= this.ledge2Rect.Height && mainSpritesRect.Top + 1 >= this.ledge2Rect.Top) {
                    this.y = this.ledge2Rect.Height + 1;
                }
                if (mainSpritesRect.Width - 2 == this.ledge2Rect.Left) {
                    this.x -= 2;
                }
                if (mainSpritesRect.Left + 1 == this.ledge2Rect.Width) {
                    this.x += 2;
                }
            }

            if (mainSpritesRect.Intersects(this.ledge3Rect)) {
                if (mainSpritesRect.Height - 3 == this.ledge3Rect.Top ||
                    mainSpritesRect.Height - 2 == this.ledge3Rect.Top ||
                    mainSpritesRect.Height - 1 == this.ledge3Rect.Top ||
                    mainSpritesRect.Height == this.ledge3Rect.Top) {
                    this.onGround = true;
                    this.y -= 1;
                    if (!this.tripSwitch) {
                        this.currentFrame += 1;
                        this.tripSwitch = true;
                    }
                }
                if (mainSpritesRect.Top + 1 <= this.ledge3Rect.Height && mainSpritesRect.Top + 1 >= this.ledge3Rect.Top) {
                    this.y = this.ledge3Rect.Height + 1;
                }
                if (mainSpritesRect.Width - 2 == this.ledge3Rect.Left) {
                    this.x -= 2;
                }
                if (mainSpritesRect.Left + 1 == this.ledge3Rect.Width) {
                    this.x += 2;
                }
            }

            if (mainSpritesRect.Intersects(collectRocketRect2) && !this.deliveredFirstPiece) {
                this.pickedUpFirstPiece = true;
            }

            if (mainSpritesRect.Intersects(collectRocketRect3) && this.getNextPiece) {
                this.pickedUpSecondPiece = true;
            }

            if (mainSpritesRect.Intersects(this.extras.Rectangle)) {
                this.score += 100;
                this.extras.Reset();
                this.extras.ResetBonus = false;
            }

            if (this.lives < 1) {
                this.gameOn = false;
            }
        }
        this.Draw();
        requestAnimationFrame(this.Update.bind(this));
    }

    private Draw(): void {
        this.ctx.fillStyle = "black";
        this.rect(0, 0, this.width, this.height);
        this.ctx.beginPath();

        if (!this.gameOn) {
            this.ctx.drawImage(this.menuBackground, 0, 0);
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText("Press S to start the game.", 40, 500);
            this.ctx.fillText("Use the arrow keys to move around.", 40, 530);
            this.ctx.fillText("Press left Ctrl to fire.", 40, 560);
        }
        else {
            var __this = this;

            this.stars.forEach(function(star) {star.Draw(__this.ctx)});
            this.bullets.forEach(function(bullet) {bullet.Draw(__this.ctx)});
            this.meteors.forEach(function(meteor) {meteor.Draw(__this.ctx)});
            this.explosionList.forEach(function(exploded) {
                if (!exploded.AnimationComplete) {
                    exploded.Draw(__this.ctx);
                }
            });

            if (this.rocketAssembled) {
                this.fuelCell.Draw(this.ctx);
                this.extras.Draw(this.ctx);
            }

            this.ctx.drawImage(this.rocketSprites, this.rocketFrame1 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket1X, this.rocket1Y, this.rocketWidth, this.rocketHeight);
            this.ctx.drawImage(this.ledge1, this.ledge1X, this.ledge1Y);
            this.ctx.drawImage(this.rocketSprites, this.rocketFrame2 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket2X, this.rocket2Y, this.rocketWidth, this.rocketHeight);
            this.ctx.drawImage(this.ledge2, this.ledge2X, this.ledge2Y);
            this.ctx.drawImage(this.rocketSprites, this.rocketFrame3 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket3X, this.rocket3Y, this.rocketWidth, this.rocketHeight);
            this.ctx.drawImage(this.ledge1, this.ledge3X, this.ledge3Y);
            this.ctx.drawImage(this.floor, this.floorX, this.floorY);

            if (this.showParticles) {
                this.part.forEach(function(particle) {particle.DrawParticle(__this.ctx, false)});
            }

            if (!this.facingLeft) {
                this.ctx.drawImage(this.gameSprites, this.currentFrame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
            }
            else {
                this.ctx.drawImage(this.gameSprites, this.currentFrame * this.spriteWidth, this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
            }

            this.ctx.font = "12px Arial";
            this.ctx.fillStyle = "yellow";

            if (this.score == 0) {
                this.ctx.fillText("SCORE : 000" + this.score, 10, 10);
            }
            else if (this.score >= 10 && this.score < 100) {
                this.ctx.fillText("SCORE : 00" + this.score, 10, 10);
            }
            else {
                this.ctx.fillText("SCORE : 0" + this.score, 10, 10);
            }
            this.ctx.fillText("FUEL : " + this.fuelLevel + "%", 350, 10);
            this.ctx.fillText("LIVES : " + this.lives, 700, 10);
        }
    }

    private ResetGame(): void {
        this.lives = 3;
        this.score = 0;
        this.rocketAssembled = false;
        this.lowerFirstPiece = false;
        this.deliveredFirstPiece = false;
        this.deliveredSecondPiece = false;
        this.level = 0;
        this.fuelLevel = 0;
        this.rocketFrame1 = 0;
        this.rocketFrame2 = 4;
        this.rocketFrame3 = 8;
        this.rocket1X = 422;
        this.rocket1Y = 443;
        this.rocket2X = 110;
        this.rocket2Y = 139;
        this.rocket3X = 510;
        this.rocket3Y = 75;
        this.fuelCell.ResetLevel = 0;
    }

    private Rocket(): void {
        if (this.pickedUpFirstPiece) {
            if (this.x != 422) {
                this.rocket2X = this.x;
                this.rocket2Y = this.y;
            }
            else if (this.x == 422 && this.rocket2Y <= 392) {
                this.rocket2X = 422;
                this.pickedUpFirstPiece = false;
                this.lowerFirstPiece = true;
                this.deliveredFirstPiece = true;
            }
        }

        if (this.lowerFirstPiece && this.rocket2Y <= 384 && !this.rocketAssembled) {
            this.rocket2Y++;
            if (this.rocket2Y == 384) {
                this.score += 100;
                this.getNextPiece = true;
            }
        }

        if (this.pickedUpSecondPiece) {
            if (this.x != 422) {
                this.rocket3X = this.x;
                this.rocket3Y = this.y;
            }
            else if (this.x == 422 && this.rocket3Y <= 332) {
                this.rocket3X = 422;
                this.pickedUpSecondPiece = false;
                this.deliveredSecondPiece = true;
                this.getNextPiece = false;
            }
        }
        if (this.deliveredSecondPiece && this.rocket3Y <= 326 && !this.rocketAssembled) {
            this.rocket3Y++;
            if (this.rocket3Y == 326)
            {
                this.score += 100;
                this.rocketAssembled = true;
            }
        }
        if (this.rocketAssembled && this.fullTank && this.rocket1Y > -100) {
            this.x = -150;
            this.y = -150;
            this.rocket3Y -= 2;
            this.rocket2Y -= 2;
            this.rocket1Y -= 2;
         }

        if (this.rocket1Y <= -100 && this.fullTank) {
            this.level++;
            this.meteor = (this.meteor + 1) % 8;
            this.fuelCell.Reset();
            this.extras.Reset();

            var __this = this;
            this.meteors.forEach(function(meteor) {
                meteor.Frame = __this.meteor;
                meteor.Reset();
            });

            this.fuelLevel = 0;
            this.fullTank = false;

            if (this.level == 4 || this.level == 8 || this.level == 12) {
                this.rocketAssembled = false;
                this.lowerFirstPiece = false;
                this.deliveredFirstPiece = false;
                this.deliveredSecondPiece = false;
            }
        }

        if (this.rocket1Y <= -100) {
            this.x = 150;
            this.y = 300;
            this.rocketAssembled = false;
            this.lowerFirstPiece = false;
            this.deliveredFirstPiece = false;
            this.deliveredSecondPiece = false;
            this.rocket1X = 422;
            this.rocket1Y = 445;
            this.rocketFrame1++;
            this.rocket2X = 110;
            this.rocket2Y = 145;
            this.rocketFrame2++;
            this.rocket3X = 510;
            this.rocket3Y = 77;
            this.rocketFrame3++;
            this.fuelLevel = 0;
            this.fuelCell.ResetLevel = 0;
        }

        if (this.level >= 16) {
            this.rocketAssembled = false;
            this.lowerFirstPiece = false;
            this.deliveredFirstPiece = false;
            this.deliveredSecondPiece = false;
            this.level = 0;
            this.fuelLevel = 0;
            this.rocketFrame1 = 0;
            this.rocketFrame2 = 4;
            this.rocketFrame3 = 8;
            this.rocket1X = 422;
            this.rocket1Y = 443;
            this.rocket2X = 110;
            this.rocket2Y = 139;
            this.rocket3X = 510;
            this.rocket3Y = 75;
            this.fuelCell.ResetLevel = 0;
        }
    }
}

export = JetPac;