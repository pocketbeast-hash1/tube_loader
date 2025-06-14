import SegmentsInfoRequest from "./abstract/SegmentsInfoRequest";

export default class SegmentsInfoRequestRutube extends SegmentsInfoRequest {
    
    public baseUrl: string;
    public resolution?: string | undefined;
    
    constructor(url: URL) {
        super(url);
        this.baseUrl = url.protocol + "//" + url.hostname + url.pathname.replace(/\.m3u8/, "");
        this.resolution = url.searchParams.get("i") || undefined;

    }

    public static isValidDomain(domain: string): boolean {
        return (
            domain.match(/.*[^bl]\.rutube\.ru*/) !== null ||
            domain.match(/.*[^bl]\.rtbcdn\.ru*/) !== null
        );
    }

    public static isSegmentsInfoRequest(url: URL): boolean {
        return (
            SegmentsInfoRequestRutube.isValidDomain(url.hostname) &&
            url.pathname.match(/\.m3u8?/) !== null
        );
    }

    public toString(): string {
        return (
            this.baseUrl +
            ".m3u8" +
            (this.resolution !== undefined ? `?i=${this.resolution}` : "")
        );
    }

}