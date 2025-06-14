import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import Segment from "./Segment";

export default class SegmentsInfo implements ISegmentsInfo {
    
    public targetDuration: number;
    public allowCache: boolean;
    public version: number;
    public mediaSequence: number;
    public videoId: string;
    public videoExt: string;
    public segments: Segment[];

    constructor(info: string) {
        
        const lines: string[] = info.split("\n");

        this.targetDuration = Number(lines[1].replace("#EXT-X-TARGETDURATION:", ""));
        
        const allowCacheStr: string = lines[2].replace("#EXT-X-ALLOW-CACHE:", "");
        this.allowCache = allowCacheStr === "YES";

        this.version = Number(lines[4].replace("#EXT-X-VERSION:", ""));
        this.mediaSequence = Number(lines[5].replace("#EXT-X-MEDIA-SEQUENCE:", ""));

        const segmentLines: string[] = lines[7].split(".");
        this.videoId = segmentLines[0];
        this.videoExt = segmentLines[1].split("/")[0];

        this.segments = new Array<Segment>;
        for (let line of lines) {        
            if (
                line.includes("#EXTM3U") || 
                line.includes("#EXT-X") || 
                line.includes("#EXTINF") ||
                !line
            ) {
                continue;
            }

            const segmentParts: string[] = line.split("/")[1].split("-");
            const segment = new Segment(
                segmentParts[0], 
                Number(segmentParts[1]), 
                segmentParts[2], 
                segmentParts[3], 
                "-"
            );

            this.segments.push(segment);
        }

    }

}