import IVideoInfo from "../../interfaces/IVideoInfo";

export default class VideoInfoPHub implements IVideoInfo {
    
    title: string;
    author_name: string;
    duration: number;
    thumbnail_url?: string | undefined;

    constructor(title: string, author_name: string, duration: number, thumbnail_url: string | undefined = undefined) {
        
        this.title = title;
        this.author_name = author_name;
        this.duration = duration;
        this.thumbnail_url = thumbnail_url;

    }

    // TODO refactor
    public static fromObject(obj: Object): IVideoInfo {

        let video: Object = {};
        if ("video" in obj && obj.video instanceof Object) {
            video = obj.video;
        } else {
            video = obj;
        }

        let title: string = "";
        let author_name: string = "";
        let duration: number = 0;
        let thumbnail_url: string = "";

        if ("title" in video && typeof video.title === "string")
            title = video.title;

        if ("duration" in video && typeof video.duration === "number") {
            duration = video.duration;
        } else if ("duration" in video && typeof video.duration === "string") {
            const durationParts = video.duration.split(":");
            const minutes = durationParts[0];
            const seconds = durationParts[1];

            duration = (Number(minutes) * 60) + Number(seconds);
        }

        if ("thumbnail_url" in video && typeof video.thumbnail_url === "string")
            thumbnail_url = video.thumbnail_url;
        else if ("thumb" in video && typeof video.thumb === "string")
            thumbnail_url = video.thumb;

        return new VideoInfoPHub(title, author_name, duration, thumbnail_url);

    };

};