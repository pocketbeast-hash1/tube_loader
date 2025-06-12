import axios, { AxiosError, AxiosResponse } from "axios";
import SegmentsInfoRequest from "../types/abstract/SegmentsInfoRequest";

export default class RequestsController {

    private static async get(url: string): Promise<any | undefined> {
        try {
            const response: AxiosResponse = await axios.get(url);
            return response.data;
            
        } catch (error) {
            if (error instanceof AxiosError) console.error(error.message);
        }
    }

    public static async getSegmentsInfo(segmentsInfoRequest: SegmentsInfoRequest): Promise<string | undefined> {
        const response = await RequestsController.get(segmentsInfoRequest.toString());
        if (response) return response;
    }

}