class BaseObject {

    protected m_x: number;
    protected m_y: number;
    protected m_width: number;
    protected m_height: number;
    protected m_frame: number;

    constructor() {
        this.m_x = 0;
        this.m_y = 0;
        this.m_width = 0;
        this.m_height = 0;
        this.m_frame = 0;
    }

    public Draw(ctx): void {
    }

    public Reset(): void {
        this.m_x = Math.floor(Math.random() * 800);
        this.m_y = -30;
    }
}

export = BaseObject;