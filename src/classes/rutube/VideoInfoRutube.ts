import VideoInfo from "../abstract/VideoInfo";

export default class VideoInfoRutube extends VideoInfo {
    
    public static fromObject(obj: Object): VideoInfo {

        if (VideoInfo.validObject(obj))
            return new VideoInfoRutube(obj.title, obj.author_name, obj.duration, obj.thumbnail_url);
        
        let title: string = "";
        let author_name: string = "";
        let duration: number = 0;
        let thumbnail_url: string = "";

        if ("title" in obj && typeof obj.title === "string")
            title = obj.title;

        if ("author" in obj && obj.author instanceof Object && "name" in obj.author && typeof obj.author.name === "string")
            author_name = obj.author.name;
        else if ("author_name" in obj && typeof obj.author_name === "string")
            author_name = obj.author_name;

        if ("duration" in obj && typeof obj.duration === "number")
            duration = obj.duration;

        if ("thumbnail_url" in obj && typeof obj.thumbnail_url === "string")
            thumbnail_url = obj.thumbnail_url;

        return new VideoInfoRutube(title, author_name, duration, thumbnail_url);

    };

};