import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import Segment from "../classes/Segment";
import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import SegmentsInfo from "../classes/SegmentsInfo";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import IVideoInfo from "../interfaces/IVideoInfo";
import * as serviceInitializer from "../controllers/service-initializer";

export default class RequestsController {

    private static async get(url: string, config: AxiosRequestConfig | undefined = undefined): Promise<any | undefined> {
        try {
            const response: AxiosResponse = await axios.get(url, config);
            return response.data;
            
        } catch (error) {
            // TODO implement error handling
            if (error instanceof AxiosError) console.error(error);
        }
    }

    public static async getSegmentsInfo(segmentsInfoRequest: SegmentsInfoRequest): Promise<ISegmentsInfo | undefined> {
        const response: string = await RequestsController.get(segmentsInfoRequest.toString());
        if (response) {
            return new SegmentsInfo(response);
        };
    }

    public static async getSegment(baseUrl: string, segment: Segment): Promise<BlobPart | undefined> {
        const response = await RequestsController.get(
            baseUrl + "/" + segment.toString(),
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