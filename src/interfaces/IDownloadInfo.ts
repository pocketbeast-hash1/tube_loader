import EServices from "../enums/EServices";
import ISegmentsInfo from "./ISegmentsInfo";
import IVideoInfo from "./IVideoInfo";

export default interface IDownloadInfo {
    service: EServices,
    tabUrl: string,
    baseUrl: string,
    segmentsInfo: ISegmentsInfo,
    videoInfo?: IVideoInfo | undefined,
};