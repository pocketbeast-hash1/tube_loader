import VideoInfo from "../abstract/VideoInfo";

export default class VideoInfoPHub extends VideoInfo {
    
    public static fromObject(obj: Object): VideoInfo {

        let video: Object = {};
        if ("video" in obj && obj.video instanceof Object) {
            video = obj.video;
        } else {
            video = obj;
        }

        if (VideoInfo.validObject(video))
            return new VideoInfoPHub(video.title, video.author_name, video.duration, video.thumbnail_url);

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