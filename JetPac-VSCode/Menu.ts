class GameMenu {

    private menuBackground: CanvasImageSource;
    private colours = [
        "#404040", "#606060", "#787878", "#989898", "#B0B0B0", "#C8C8C8", "#DCDCDC", "#F5F5F5",
        "#DCDCDC", "#C8C8C8", "#B0B0B0", "#989898", "#787878", "#606060", "#404040"
    ];
    private colour: string;
    private index: number;
    private animTimer: number;

    constructor(background) {
        this.menuBackground = background;
        this.index = 0;
        this.animTimer = 0;
    }

    public update(): void {
        this.animTimer += 0.1;
        if (this.animTimer > 0.7) {
            this.index = this.index % (this.colours.length - 1) + 1;
            this.animTimer = 0;
            this.colour = this.colours[this.index];
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.menuBackground, 0, 0);
        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Press", 40, 500);
        ctx.fillStyle = this.colour;
        ctx.fillText("S", 95, 500);
        ctx.fillStyle = "yellow";
        ctx.fillText(" to start the game.", 110, 500);
        ctx.fillText("Use the arrow keys to move around.", 40, 530);
        ctx.fillText("Press left Ctrl to fire.", 40, 560);
    }
}

export = GameMenu;
