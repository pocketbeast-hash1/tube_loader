import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import ManifestRequest from "../classes/abstract/ManifestRequest";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import IVideoInfo from "../interfaces/IVideoInfo";
import { Manifest, Segment } from "m3u8-parser";
import * as serviceInitializer from "../controllers/service-initializer";
import * as m3u8Controller from "../controllers/m3u8-controller";

export default class RequestsController {

    private static async get(url: string, config: AxiosRequestConfig | undefined = undefined): Promise<any | undefined> {
        try {
            let timeout: number | undefined = config?.timeout;
            if (!timeout)
                timeout = 3000

            const response: AxiosResponse = await axios.get(url, { ...config, timeout });
            return response.data;
            
        } catch (error) {
            // TODO implement error handling
            if (error instanceof AxiosError) console.error(error);
        }
    }

    public static async getManifest(manifestRequest: ManifestRequest): Promise<Manifest | undefined> {
        const response: string | undefined = await RequestsController.get(manifestRequest.manifestUrl);
        if (response) {
            return m3u8Controller.getManifest(response);
        };
    }

    public static async getSegment(baseUrl: string, segment: Segment): Promise<BlobPart | undefined> {
        const response = await RequestsController.get(
            baseUrl + "/" + segment.uri,
            { responseType: "blob" }
        );
        
        if (response) return response;
    }

    public static async getVideoInfo(videoInfoRequest: VideoInfoRequest): Promise<IVideoInfo | undefined> {
        const response: string | undefined = await RequestsController.get(
            videoInfoRequest.toString(),
            { responseType: "json" }
        );

        if (response)
            return serviceInitializer.getVideoInfoFromObject(response, videoInfoRequest.service);
    }

}