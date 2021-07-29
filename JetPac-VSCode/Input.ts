class InputControls {

    private m_left: boolean;
    private m_right: boolean;
    private m_up: boolean;
    private m_down: boolean;
    private m_fire: boolean;

    constructor() {
        this.m_left = false;
        this.m_right = false;
        this.m_up = false;
        this.m_down = false;
        this.m_fire = false;
    }

    public get left(): boolean {
        return this.m_left;
    }

    public set left(value: boolean) {
        this.m_left = value;
    }

    public get right(): boolean {
        return this.m_right;
    }

    public set right(value: boolean) {
        this.m_right = value;
    }

    public get up(): boolean {
        return this.m_up;
    }

    public set up(value: boolean) {
        this.m_up = value;
    }

    public get down(): boolean {
        return this.m_down;
    }

    public set down(value: boolean) {
        this.m_down = value;
    }

    public get fire(): boolean {
        return this.m_fire;
    }

    public set fire(value: boolean) {
        this.m_fire = value;
    }
}

export = InputControls;