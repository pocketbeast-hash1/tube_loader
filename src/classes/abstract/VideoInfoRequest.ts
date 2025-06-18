import EServices from "../../enums/EServices";

export default abstract class VideoInfoRequest {

    public readonly service: EServices = EServices.Undefined;
    protected baseUrl: string = "";
    public videoId: string;

    constructor(videoId: string) {
        this.videoId = videoId;
    }

    public toString(): string {
        return this.baseUrl + this.videoId;
    }

}