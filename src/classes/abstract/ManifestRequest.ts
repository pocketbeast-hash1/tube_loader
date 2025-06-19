import EServices from "../../enums/EServices";

export default abstract class ManifestRequest {

    public readonly service: EServices = EServices.Undefined;
    public readonly manifestUrl: string;
    public readonly baseUrl: string;

    constructor(url: URL) {
        this.manifestUrl = url.href;
        this.baseUrl = url.protocol + "//" + url.hostname + url.pathname.replace(/\.m3u8/, "");
    }

    public static isValidDomain(domain: string): boolean {
        return false;
    }

    public static isSegmentsInfoRequest(url: URL): boolean {
        return (
            this.isValidDomain(url.hostname) &&
            url.pathname.match(/\.m3u8?/) !== null
        );
    }

}