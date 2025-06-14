import ISegment from "../interfaces/ISegment";

export default class Segment implements ISegment {

    public name: string;
    public num: number;
    public version: string;
    public ext: string;
    public separator: string;

    constructor(name: string, num: number, version: string, ext: string, separator: string = "-") {
        this.name = name;
        this.num = num;
        this.version = version;
        this.ext = ext;
        this.separator = separator;
    }

    public toString(): string {
        const parts = [ this.name, this.num, this.version, this.ext ];
        return parts.join(this.separator);
    }

}