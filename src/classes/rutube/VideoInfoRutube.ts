import IVideoInfo from "../../interfaces/IVideoInfo";

export default class VideoInfoRutube implements IVideoInfo {
    
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