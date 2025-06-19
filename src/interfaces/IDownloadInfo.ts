import { Manifest } from "m3u8-parser";
import EServices from "../enums/EServices";
import IVideoInfo from "./IVideoInfo";

export default interface IDownloadInfo {
    service: EServices,
    tabUrl: string,
    baseUrl: string,
    manifest: Manifest | undefined;
    videoInfo?: IVideoInfo | undefined,
};