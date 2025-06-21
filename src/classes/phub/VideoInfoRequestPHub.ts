import EServices from "../../enums/EServices";
import VideoInfoRequest from "../abstract/VideoInfoRequest";

export default class VideoInfoRequestPHub extends VideoInfoRequest {

    public readonly service: EServices = EServices.PHub;
    protected baseUrl: string = "https://www.pornhub.com/webmasters/video_by_id";

    public static getVideoIdFromLink(link: string): string | undefined {
        const { searchParams } = new URL(link);
        return searchParams.get("viewkey") || undefined;
    }

    public toString(): string {
        return this.baseUrl + `?id=${this.videoId}`;
    }

};