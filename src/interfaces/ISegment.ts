export default interface ISegment {
    name: string;
    num: number;
    version: string;
    ext: string;
    separator: string;
    
    toString(): string;
}