import EServices from "../enums/EServices";
import IDownloadInfo from "../interfaces/IDownloadInfo";
import VideoInfo from "./abstract/VideoInfo";
import { Manifest } from "m3u8-parser";
import * as serviceInitializer from "../controllers/service-initializer";

export default class DownloadInfo implements IDownloadInfo {
    service: EServices = EServices.Undefined;
    tabUrl: string = "";
    baseUrl: string = "";
    manifest: Manifest | undefined;
    videoInfo?: VideoInfo | undefined;
    
    constructor(obj: IDownloadInfo) {

        this.service = obj.service;
        this.tabUrl = obj.tabUrl;
        this.baseUrl = obj.baseUrl;

        if (obj.manifest)
            this.manifest = <Manifest> obj.manifest;

        if (obj.videoInfo)
            this.videoInfo = serviceInitializer.getVideoInfoFromObject(
                obj.videoInfo,
                this.service
            );

    }
}