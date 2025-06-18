import EServices from "../enums/EServices";
import VideoInfoRequest from "./abstract/VideoInfoRequest";

export default class VideoInfoRequestRutube extends VideoInfoRequest {

    public readonly service: EServices = EServices.Rutube;
    protected baseUrl: string = "https://rutube.ru/api/video/";

    public static getVideoIdFromLink(link: string): string | undefined {
        const { pathname } = new URL(link);
        const pieces = pathname.split("/");
        if (pieces.length > 1)
            return pieces[pieces.length - 2];
    }

};