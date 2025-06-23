export default abstract class VideoInfo {

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

    public static validObject(obj: Object): obj is VideoInfo {

        return (
            ("title" in obj && typeof obj.title === "string") &&
            ("author_name" in obj && typeof obj.author_name === "string") &&
            ("duration" in obj && typeof obj.duration === "number") &&
            ("thumbnail_url" in obj && typeof obj.thumbnail_url === "string")
        );

    }

};