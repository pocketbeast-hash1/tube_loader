import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import Segment from "../classes/Segment";

export default class RequestsController {

    private static async get(url: string, config: AxiosRequestConfig | undefined = undefined): Promise<any | undefined> {
        try {
            const response: AxiosResponse = await axios.get(url, config);
            return response.data;
            
        } catch (error) {
            if (error instanceof AxiosError) console.error(error.message);
        }
    }

    public static async getSegmentsInfo(segmentsInfoRequest: SegmentsInfoRequest): Promise<string | undefined> {
        const response = await RequestsController.get(segmentsInfoRequest.toString());
        if (response) return response;
    }

    public static async getSegment(baseUrl: string, segment: Segment): Promise<BlobPart | undefined> {
        const response = await RequestsController.get(
            baseUrl + "/" + segment.toString(),
            { responseType: "blob" }
        );
        
        if (response) return response;
    }

}