import ISegment from "./ISegment";

export default interface ISegmentsInfo {
    targetDuration: number;
    allowCache: boolean;
    version: number;
    mediaSequence: number;
    videoId: string;
    videoExt: string;
    segments: ISegment[];
}