import IDownloadInfo from "../interfaces/IDownloadInfo";
import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import SegmentsInfo from "./SegmentsInfo";

export default class DownloadInfo implements IDownloadInfo {
    tabUrl: string = "";
    baseUrl: string = "";
    segmentsInfo: ISegmentsInfo = new SegmentsInfo({});
    
    // TODO refactor. Don't proud for this
    constructor(obj: IDownloadInfo) {

        if ("tabUrl" in obj && typeof obj.tabUrl === "string")
            this.tabUrl = obj.tabUrl;

        if ("baseUrl" in obj && typeof obj.baseUrl === "string")
            this.baseUrl = obj.baseUrl;

        if ("segmentsInfo" in obj && obj.segmentsInfo instanceof Object)
            this.segmentsInfo = new SegmentsInfo(obj.segmentsInfo);

    }
}