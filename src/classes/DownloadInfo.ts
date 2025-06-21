import EServices from "../enums/EServices";
import IDownloadInfo from "../interfaces/IDownloadInfo";
import IVideoInfo from "../interfaces/IVideoInfo";
import { Manifest } from "m3u8-parser";
import * as serviceInitializer from "../controllers/service-initializer";

export default class DownloadInfo implements IDownloadInfo {
    service: EServices = EServices.Undefined;
    tabUrl: string = "";
    baseUrl: string = "";
    manifest: Manifest | undefined;
    videoInfo?: IVideoInfo | undefined;
    
    // TODO refactor. Don't proud for this
    constructor(obj: IDownloadInfo) {

        if ("service" in obj)
            this.service = obj.service;

        if ("tabUrl" in obj && typeof obj.tabUrl === "string")
            this.tabUrl = obj.tabUrl;

        if ("baseUrl" in obj && typeof obj.baseUrl === "string")
            this.baseUrl = obj.baseUrl;

        this.manifest = <Manifest> obj.manifest;

        if ("videoInfo" in obj && obj.videoInfo instanceof Object)
            this.videoInfo = serviceInitializer.getVideoInfoFromObject(
                obj.videoInfo,
                this.service
            );

    }
}