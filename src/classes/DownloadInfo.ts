import EServices from "../enums/EServices";
import IDownloadInfo from "../interfaces/IDownloadInfo";
import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import IVideoInfo from "../interfaces/IVideoInfo";
import SegmentsInfo from "./SegmentsInfo";
import * as serviceInitializer from "../controllers/service-initializer";

export default class DownloadInfo implements IDownloadInfo {
    service: EServices = EServices.Undefined;
    tabUrl: string = "";
    baseUrl: string = "";
    segmentsInfo: ISegmentsInfo = new SegmentsInfo({});
    videoInfo?: IVideoInfo | undefined = undefined;
    
    // TODO refactor. Don't proud for this
    constructor(obj: IDownloadInfo) {

        if ("service" in obj)
            this.service = obj.service;

        if ("tabUrl" in obj && typeof obj.tabUrl === "string")
            this.tabUrl = obj.tabUrl;

        if ("baseUrl" in obj && typeof obj.baseUrl === "string")
            this.baseUrl = obj.baseUrl;

        if ("segmentsInfo" in obj && obj.segmentsInfo instanceof Object)
            this.segmentsInfo = new SegmentsInfo(obj.segmentsInfo);

        if ("videoInfo" in obj && obj.videoInfo instanceof Object)
            this.videoInfo = serviceInitializer.getVideoInfoFromObject(
                obj.videoInfo,
                this.service
            );

    }
}