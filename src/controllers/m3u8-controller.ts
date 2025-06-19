import { Parser, Manifest } from "m3u8-parser";

export const getManifest = (manifestStr: string): Manifest => {
    const parser: Parser = new Parser();
    parser.push(manifestStr);
    parser.end;

    return parser.manifest;
};