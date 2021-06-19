class Rectangle {

    private m_left: number;
    private m_top: number;
    private m_right: number;
    private m_bottom: number;
    private m_width: number;
    private m_height: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.m_left = left;
        this.m_top = top;
        this.m_right = right;
        this.m_bottom = bottom;
        this.m_width = right + left;
        this.m_height = bottom + top;
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

    Intersects(rect: Rectangle) {
        var t: Rectangle = this.FromLTRB(this.Left, this.Top, this.Right, this.Bottom);
        var f: Rectangle = this.FromLTRB(rect.Left, rect.Top, rect.Right, rect.Bottom);
        var result1 = (t.Left < f.Right &&
            t.Right > f.Left &&
            t.Top < f.Bottom &&
            t.Bottom > f.Top);

        return result1;
    }

    private FromLTRB(left: number, top: number, right: number, bottom: number) {
        return new Rectangle(left, top, right + left, bottom + top);
    }
}

export = Rectangle;