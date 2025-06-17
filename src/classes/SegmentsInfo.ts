import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import Segment from "./Segment";

export default class SegmentsInfo implements ISegmentsInfo {
    
    public targetDuration: number = 0;
    public allowCache: boolean = false;
    public version: number = 0;
    public mediaSequence: number = 0;
    public videoId: string = "";
    public videoExt: string = "";
    public segments: Segment[] = [];

    constructor(info: string | Object) {

        if (typeof info === "string") {
            this.fromString(info);
        } else {
            this.fromObject(info);
        }

    }

    private fromString(info: string): void {
        
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

    // TODO refactor. Don't proud for this
    private fromObject(obj: Object): void {
        
        if ("targetDuration" in obj && typeof obj.targetDuration === "number")
            this.targetDuration = obj.targetDuration;

        if ("allowCache" in obj && typeof obj.allowCache === "boolean")
            this.allowCache = obj.allowCache;

        if ("version" in obj && typeof obj.version === "number")
            this.version = obj.version;

        if ("mediaSequence" in obj && typeof obj.mediaSequence === "number")
            this.mediaSequence = obj.mediaSequence;

        if ("videoId" in obj && typeof obj.videoId === "string")
            this.videoId = obj.videoId;

        if ("videoExt" in obj && typeof obj.videoExt === "string")
            this.videoExt = obj.videoExt;

        if ("segments" in obj && obj.segments instanceof Array && obj.segments.length > 0) {
            const segments: Segment[] = [];
            obj.segments.forEach(segment => {
                if (segment instanceof Object) {
                    if ("name" in segment && "num" in segment && "version" in segment && "ext" in segment) {
                        const seg: Segment = new Segment(
                            segment.name,
                            segment.num,
                            segment.version,
                            segment.ext,
                            segment?.separator
                        );
                        segments.push(seg);
                    }
                }
            });

            this.segments = segments;
        }

    }

}