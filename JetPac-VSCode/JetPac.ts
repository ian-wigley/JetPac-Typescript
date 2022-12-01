import Bonus = require("./Bonus");
import Bullet = require("./Bullet");
import Controls = require("./Input");
import Explosion = require("./Explosion");
import Fuel = require("./Fuel");
import JetMan = require("./JetMan");
import Menu = require("./Menu");
import Meteorite = require("./Meteor");
import Particle = require("./Particle");
import Rectangle = require("./Rectangle");
import Starfield = require("./StarField");

class JetPac {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private width: number = 800;
    private height: number = 600;

    private rocketSprites: HTMLImageElement;
    private floor: HTMLImageElement;
    private ledge1: HTMLImageElement;
    private ledge2: HTMLImageElement;
    private explosion: HTMLImageElement;
    private bullet: HTMLImageElement;

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
    private jetman: JetMan;
    private controls: Controls;
    private menu: Menu;

    private paddedScore: string = "";
    private score: number;
    private lives: number;
    private fuelLevel: number = 0;

    private gameOn: boolean = false;

    private rocketWidth: number = 75;
    private rocketHeight: number = 61;

    private rocket1X: number;
    private rocket1Y: number;
    private rocketFrame1: number;

    private rocket2X: number;
    private rocket2Y: number;
    private rocketFrame2: number;

    private rocket3X: number;
    private rocket3Y: number;
    private rocketFrame3: number;

    private level: number = 16;
    private meteor: number = 0;

    private floorX: number = 0;
    private floorY: number = 500;

    public ledge1X: number = 60;
    public ledge1Y: number = 200;
    public ledge2X: number = 310;
    public ledge2Y: number = 265;
    public ledge3X: number = 490;
    public ledge3Y: number = 136;

    private showParticles: boolean = false;
    private pickedUpFirstPiece: boolean = false;
    private deliveredFirstPiece: boolean = false;
    private pickedUpSecondPiece: boolean = false;
    private deliveredSecondPiece: boolean = false;
    private lowerFirstPiece: boolean = false;
    private rocketAssembled: boolean = false;
    private fullTank: boolean = false;
    private getNextPiece: boolean = false;
    private fired: boolean = false;

    private floorRect: Rectangle;
    private ledge1Rect: Rectangle;
    private ledge2Rect: Rectangle;
    private ledge3Rect: Rectangle;

    private rect(x: number, y: number, w: number, h: number): void {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    public run(): void {
        this.initialize();
    }

    private initialize(): void {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.controls = new Controls();

        this.rocketSprites = <HTMLImageElement>document.getElementById("rocket_sprites");
        this.floor = <HTMLImageElement>document.getElementById("floor");
        this.ledge1 = <HTMLImageElement>document.getElementById("ledge1");
        this.ledge2 = <HTMLImageElement>document.getElementById("ledge2");
        this.explosion = <HTMLImageElement>document.getElementById("explosion");
        this.bullet = <HTMLImageElement>document.getElementById("bullet");

        this.firedSound = <HTMLAudioElement>document.getElementById("fired");
        this.collisionSound = <HTMLAudioElement>document.getElementById("collision");
        this.destroyedSound = <HTMLAudioElement>document.getElementById("destroyed");

        this.floorRect = new Rectangle(this.floorX, this.floorY, this.floor.width, this.floor.height);
        this.ledge1Rect = new Rectangle(this.ledge1X, this.ledge1Y, this.ledge1.width, this.ledge1.height);
        this.ledge2Rect = new Rectangle(this.ledge2X, this.ledge2Y, this.ledge2.width, this.ledge2.height);
        this.ledge3Rect = new Rectangle(this.ledge3X, this.ledge3Y, this.ledge1.width, this.ledge1.height);

        this.menu = new Menu(<HTMLImageElement>document.getElementById("loading"));

        this.meteors = new Array<Meteorite>(10);
        for (var i = 0; i < 10; i++) {
            this.meteors.push(
                new Meteorite(<HTMLImageElement>document.getElementById("meteor"),
                    this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect));
        }

        this.stars = new Array<Starfield>();
        this.part = new Array<Particle>();
        for (var j = 0; j < 1; j++) {  //40
            this.stars.push(new Starfield());
            this.part.push(new Particle());
        }

        this.fuelCell = new Fuel(<HTMLImageElement>document.getElementById("fuel_cell"), this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect);
        this.extras = new Bonus(<HTMLImageElement>document.getElementById("bonus"), this.floorRect, this.ledge1Rect, this.ledge2Rect, this.ledge3Rect);
        this.bullets = new Array<Bullet>();
        this.explosionList = new Array<Explosion>();

        this.jetman = new JetMan(<HTMLImageElement>document.getElementById("sprites"), 150, 300);

        this.addHitListener();
        this.update()
    }

    private addHitListener(): void {
        window.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });

        window.addEventListener("keyup", (event) => {
            this.onKeyUp(event);
            return null;
        });
    }

    onKeyPress(event: KeyboardEvent): void {
        event.preventDefault();
        this.onKeyboardPress(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        event.preventDefault();
        this.onKeyboardRelease(event);
    }

    onKeyboardPress(event: KeyboardEvent): void {
        switch (event.key) {
            case "Control":
                if (!this.fired) {
                    this.controls.fire = true;
                    this.fired = true;
                }
                break;
            case "ArrowLeft":
                this.controls.left = true;
                break;
            case "ArrowUp":
                this.controls.up = true;
                break;
            case "ArrowRight":
                this.controls.right = true;
                break;
            case "ArrowDown":
                this.controls.down = true;
                break;
            case "s":
                if (!this.gameOn) {
                    this.gameOn = true;
                    this.resetGame();
                }
                break;
        }
    }

    onKeyboardRelease(event: KeyboardEvent): void {
        switch (event.key) {
            case "Control":
                this.controls.fire = false;
                this.fired = false;
                break;
            case "ArrowLeft":
                this.controls.left = false;
                break;
            case "ArrowUp":
                this.controls.up = false;
                break;
            case "ArrowRight":
                this.controls.right = false;
                break;
            case "ArrowDown":
                this.controls.down = false;
                break;
            default:
                this.controls.fire = false;
                break;
        }
    }

    private update(): void {
        if (this.gameOn) {
            this.fireBullet();
            this.jetman.Update(this.controls);
            this.moveJetmanUp();

            let jetmanRectangle: Rectangle = this.jetman.rectangle;
            let collectRocketRect2: Rectangle = new Rectangle(this.rocket2X, this.rocket2Y, this.rocketWidth, this.rocketHeight);
            let collectRocketRect3: Rectangle = new Rectangle(this.rocket3X, this.rocket3Y, this.rocketWidth, this.rocketHeight);

            this.updateRocket();
            this.updateParticles();
            this.updateStars();
            this.updateMeteors(jetmanRectangle);

            // Test to see if resetting this fixes the issue !!!
            jetmanRectangle = this.jetman.rectangle;

            this.updateExplosions();
            this.updateBullets();

            this.checkFuelCollision(jetmanRectangle);
            this.checkExtrasCollision(jetmanRectangle);

            if (this.checkIfRequired()) {
                this.checkFloorCollision(jetmanRectangle);
                this.checkLedgeCollision(jetmanRectangle, this.ledge1Rect);
                this.checkLedgeCollision(jetmanRectangle, this.ledge2Rect);
                this.checkLedgeCollision(jetmanRectangle, this.ledge3Rect);
            }

            this.checkRocketSection2Collision(jetmanRectangle, collectRocketRect2);
            this.checkRocketSection3Collision(jetmanRectangle, collectRocketRect3);

            this.checkLives();
            this.checkLevel();

        }
        else {
            this.menu.update();
        }
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    private checkIfRequired(): boolean {
        return !this.jetman.stoodOnLedge ||
            !this.jetman.stoodOnFloor ||
            this.controls.left ||
            this.controls.right ||
            this.controls.up ||
            this.controls.down;
    }

    private checkLives(): void {
        if (this.lives < 1) {
            this.resetGame();
            this.gameOn = false;
        }
    }

    private checkLevel(): void {
        if (this.level >= 16) {
            this.resetLevels();
        }
    }

    private updateStars(): void {
        this.stars.forEach(function (star) { star.Update(); });
    }

    private updateParticles(): void {
        let __this = this;
        this.part.forEach(function (particle) { particle.UpdateParticle(__this.jetman.x, __this.jetman.y, __this.jetman.facing, __this.showParticles); });
    }

    private updateMeteors(mainSpritesRect: Rectangle): void {
        let __this = this;
        __this.meteors.forEach(function (meteor) {
            meteor.Update(mainSpritesRect);
            if (meteor.LedgeCollision) {
                __this.explosionList.push(new Explosion(__this.explosion, meteor.X, meteor.Y));
                __this.destroyedSound.play();
                meteor.Reset();
                meteor.LedgeCollision = false;
            }

            if (meteor.JetManCollision) {
                __this.lives -= 1;
                __this.explosionList.push(new Explosion(__this.explosion, __this.jetman.x, __this.jetman.y));
                meteor.Reset();
                __this.jetman.resetPosition();
                meteor.JetManCollision = false;
                __this.collisionSound.play();
                if (__this.pickedUpFirstPiece) {
                    __this.resetFirstRocketSection();
                }
                if (__this.pickedUpSecondPiece) {
                    __this.resetSecondRocketSection();
                }
            }

            var temp = [];
            __this.bullets.forEach(function (bullet) {
                if (bullet.Rectangle.Intersects(meteor.Rectangle)) {
                    __this.destroyedSound.play();
                    __this.explosionList.push(new Explosion(__this.explosion, meteor.X, meteor.Y));
                    meteor.Reset();
                    __this.score += 100;
                    __this.updateScore();
                }
                else {
                    temp.push(bullet);
                }
            });

            __this.bullets = [];
            __this.bullets = temp;
        });
    }

    private updateExplosions(): void {
        var temp = [];
        this.explosionList.forEach(function (exploded) {
            if (!exploded.AnimationComplete) {
                exploded.Update();
                temp.push(exploded);
            }
        });
        this.explosionList = [];
        this.explosionList = temp;
    }

    private updateBullets(): void {
        var temp = [];
        this.bullets.forEach(function (bullet) {
            if (!bullet.Offscreen) {
                bullet.Update();
                temp.push(bullet);
            }
        });
        this.bullets = [];
        this.bullets = temp;
    }

    private checkFuelCollision(mainSpritesRect: Rectangle): void {
        if (this.rocketAssembled) {
            var collided = false;
            if (mainSpritesRect.Intersects(this.fuelCell.Rectangle)) {
                collided = true;
            }

            this.fuelCell.UpdateFuelCell(this.jetman.x, this.jetman.y, collided);
            this.fuelLevel = this.fuelCell.FuelLevel;
            if (this.fuelLevel == 100) {
                this.fullTank = true;
            }

            this.extras.Update();
        }
    }

    private checkFloorCollision(mainSpritesRect: Rectangle): void {
        if (mainSpritesRect.Intersects(this.floorRect)) {
            this.jetman.stoodOnLedge = true;
            this.jetman.y -= 1;
            if (!this.jetman.animation) {
                this.jetman.frame += 1;
                this.jetman.animation = true;
            }
        }
    }

    private checkLedgeCollision(jetmanRectangle: Rectangle, ledge: Rectangle): void {
        if (jetmanRectangle.Intersects(ledge)) {
            if (jetmanRectangle.Bottom - 3 == ledge.Top ||
                jetmanRectangle.Bottom - 2 == ledge.Top ||
                jetmanRectangle.Bottom - 1 == ledge.Top ||
                jetmanRectangle.Bottom == ledge.Top) {
                this.jetman.stoodOnLedge = true;
                this.jetman.y -= 1;
                if (!this.jetman.animation) {
                    this.jetman.frame += 1;
                    this.jetman.animation = true;
                }
            }
            if (jetmanRectangle.Top + 1 <= ledge.Bottom && jetmanRectangle.Top + 1 >= ledge.Top) {
                this.jetman.y = ledge.Bottom + 1;
            }
            if (jetmanRectangle.Right - 2 == ledge.Left) {
                this.jetman.x -= 2;
            }
            if (jetmanRectangle.Left + 1 == ledge.Right) {
                this.jetman.x += 2;
            }
        }
    }

    private checkRocketSection2Collision(mainSpritesRect: Rectangle, collectRocketRect2: Rectangle): void {
        if (mainSpritesRect.Intersects(collectRocketRect2) && !this.deliveredFirstPiece && !this.pickedUpFirstPiece) {
            this.pickedUpFirstPiece = true;
        }
    }

    private checkRocketSection3Collision(mainSpritesRect: Rectangle, collectRocketRect3: Rectangle): void {
        if (mainSpritesRect.Intersects(collectRocketRect3) && this.getNextPiece && !this.pickedUpSecondPiece) {
            this.pickedUpSecondPiece = true;
        }
    }

    private checkExtrasCollision(mainSpritesRect: Rectangle): void {
        if (mainSpritesRect.Intersects(this.extras.Rectangle)) {
            this.score += 100;
            this.updateScore();
            this.extras.Reset();
            this.extras.ResetBonus = false;
        }
    }

    private moveJetmanUp(): void {
        if (this.controls.up) {
            this.showParticles = true;
        } else {
            this.showParticles = false;
        }
    }

    private fireBullet(): void {
        if (this.controls.fire) {
            this.bullets.push(new Bullet(this.bullet, this.jetman.x, this.jetman.y, this.jetman.facing));
            this.controls.fire = false;
            this.firedSound.play();
        }
    }

    private draw(): void {
        this.ctx.fillStyle = "black";
        this.rect(0, 0, this.width, this.height);
        this.ctx.beginPath();

        if (!this.gameOn) {
            this.menu.draw(this.ctx);
        }
        else {
            this.drawGameScreen();
        }
    }

    private drawGameScreen(): void {
        var __this = this;
        this.stars.forEach(function (star) { star.Draw(__this.ctx); });
        this.bullets.forEach(function (bullet) { bullet.Draw(__this.ctx); });
        this.meteors.forEach(function (meteor) { meteor.Draw(__this.ctx); });
        this.explosionList.forEach(function (exploded) {
            if (!exploded.AnimationComplete) {
                exploded.Draw(__this.ctx);
            }
        });

        if (this.rocketAssembled) {
            this.fuelCell.Draw(this.ctx);
            this.extras.Draw(this.ctx);
        }

        this.ctx.beginPath();
        this.ctx.rect(this.rocket2X, this.rocket2Y, this.rocketWidth, this.rocketHeight);
        this.ctx.fillStyle = "red";
        this.ctx.fill();

        this.ctx.drawImage(this.rocketSprites, this.rocketFrame1 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket1X, this.rocket1Y, this.rocketWidth, this.rocketHeight);
        this.ctx.drawImage(this.ledge1, this.ledge1X, this.ledge1Y);
        this.ctx.drawImage(this.rocketSprites, this.rocketFrame2 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket2X, this.rocket2Y, this.rocketWidth, this.rocketHeight);
        this.ctx.drawImage(this.ledge2, this.ledge2X, this.ledge2Y);
        this.ctx.drawImage(this.rocketSprites, this.rocketFrame3 * this.rocketWidth, 0, this.rocketWidth, this.rocketHeight, this.rocket3X, this.rocket3Y, this.rocketWidth, this.rocketHeight);
        this.ctx.drawImage(this.ledge1, this.ledge3X, this.ledge3Y);
        this.ctx.drawImage(this.floor, this.floorX, this.floorY);

        if (this.showParticles) {
            this.part.forEach(function (particle) { particle.DrawParticle(__this.ctx, false); });
        }

        this.jetman.Draw(this.ctx);

        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("SCORE : " + this.paddedScore, 10, 10);
        this.ctx.fillText("FUEL : " + this.fuelLevel + "%", 350, 10);
        this.ctx.fillText("LIVES : " + this.lives, 700, 10);
    }

    private updateScore(): void {
        this.paddedScore = this.score.toString().padStart(5, '0');
    }

    private resetGame(): void {
        this.jetman.resetPosition();
        this.lives = 300;
        this.score = 0;
        this.updateScore();
        this.meteor = 0;
        this.resetMeteors();
        this.fuelCell.Reset();
        this.extras.Reset();
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

    private resetMeteors(): void {
        var __this = this;
        this.meteors.forEach(function (meteor) {
            meteor.Frame = __this.meteor;
            meteor.Reset();
        });
    }

    private updateRocket(): void {
        this.updateFirstRocketSection();
        this.enableSecondRocketSection();
        this.updateSecondRocketSection();
        this.enableFuelToBeCollected();
        this.updateRocketDuringTakeOff();
        this.initiateNextLevel();
        this.resetRocketAfterTakeOff();
    }

    private initiateNextLevel(): void {
        if (this.rocket1Y <= -100 && this.fullTank) {
            this.level++;
            this.meteor = (this.meteor + 1) % 8;
            this.fuelCell.Reset();
            this.extras.Reset();
            this.resetMeteors();
            this.fuelLevel = 0;
            this.fullTank = false;

            if (this.level == 4 || this.level == 8 || this.level == 12) {
                this.rocketAssembled = false;
                this.lowerFirstPiece = false;
                this.deliveredFirstPiece = false;
                this.deliveredSecondPiece = false;
            }
        }
    }

    private updateRocketDuringTakeOff(): void {
        if (this.rocketAssembled && this.fullTank && this.rocket1Y > -100) {
            this.jetman.x = -150;
            this.jetman.y = -150;
            this.rocket3Y -= 2;
            this.rocket2Y -= 2;
            this.rocket1Y -= 2;
        }
    }

    private enableFuelToBeCollected(): void {
        if (this.deliveredSecondPiece && this.rocket3Y <= 326 && !this.rocketAssembled) {
            this.rocket3Y++;
            if (this.rocket3Y == 326) {
                this.score += 100;
                this.updateScore();
                this.rocketAssembled = true;
            }
        }
    }

    private updateSecondRocketSection(): void {
        if (this.pickedUpSecondPiece) {
            if (this.jetman.x != 422) {
                this.rocket3X = this.jetman.x;
                this.rocket3Y = this.jetman.y;
            }
            else if (this.jetman.x == 422 && this.rocket3Y <= 332) {
                this.rocket3X = 422;
                this.pickedUpSecondPiece = false;
                this.deliveredSecondPiece = true;
                this.getNextPiece = false;
            }
        }
    }

    private enableSecondRocketSection(): void {
        if (this.lowerFirstPiece && this.rocket2Y <= 384 && !this.rocketAssembled) {
            this.rocket2Y++;
            if (this.rocket2Y == 384) {
                this.score += 100;
                this.updateScore();
                this.getNextPiece = true;
            }
        }
    }

    private resetRocketAfterTakeOff(): void {
        if (this.rocket1Y <= -100) {
            this.jetman.resetPosition();
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
    }

    private updateFirstRocketSection(): void {
        if (this.pickedUpFirstPiece) {
            if (this.jetman.x != 422) {
                this.rocket2X = this.jetman.x;
                this.rocket2Y = this.jetman.y;
            }
            else if (this.jetman.x == 422 && this.rocket2Y <= 392) {
                this.rocket2X = 422;
                this.pickedUpFirstPiece = false;
                this.lowerFirstPiece = true;
                this.deliveredFirstPiece = true;
            }
        }
    }

    private resetFirstRocketSection(): void {
        this.rocket2X = 110;
        this.rocket2Y = 139;
        this.pickedUpFirstPiece = false;
    }

    private resetSecondRocketSection(): void {
        this.rocket3X = 510;
        this.rocket3Y = 75;
        this.pickedUpSecondPiece = false;
    }

    private resetLevels(): void {
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

export = JetPac;