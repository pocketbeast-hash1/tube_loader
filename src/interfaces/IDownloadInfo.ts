import ISegmentsInfo from "./ISegmentsInfo";

export default interface IDownloadInfo {
    tabUrl: string,
    baseUrl: string,
    segmentsInfo: ISegmentsInfo,
};