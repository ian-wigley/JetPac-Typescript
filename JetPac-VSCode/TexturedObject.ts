import Base = require("./BaseObject");

class TexturedObject extends Base {

    protected m_texture: HTMLImageElement;

    constructor(texture: HTMLImageElement) {
        super();
        this.m_texture = texture;
    }
}

export = TexturedObject;