class Rectangle {

    private m_left: number;
    private m_top: number;
    private m_right: number;
    private m_bottom: number;
    private m_width: number;
    private m_height: number;

    private x: number;
    private y: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.m_width = width;
        this.m_height = height;
        this.m_top = y;
        this.m_bottom = y + height;
        this.m_left = x;
        this.m_right = x + width;
    }

    public get Left(): number {
        return this.m_left;
    }

    public get Top(): number {
        return this.m_top;
    }

    public get Right(): number {
        return this.m_right;
    }

    public get Bottom(): number {
        return this.m_bottom;
    }

    public get Width() {
        return this.m_width;
    }

    public get Height() {
        return this.m_height;
    }

    public Intersects(value: Rectangle): boolean {
        if (value.x < this.x + this.Width &&
            this.x < value.x + value.Width &&
            value.y < this.y + this.Height) {
            return this.y < value.y + value.Height;
        }
        return false;
    }

    public update(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}

export = Rectangle;