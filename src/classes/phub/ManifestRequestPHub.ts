import EServices from "../../enums/EServices";
import ManifestRequest from "../abstract/ManifestRequest";

export default class ManifestRequestPHub extends ManifestRequest {
    
    public readonly service: EServices = EServices.PHub;
    
    public static isValidDomain(domain: string): boolean {
        return (
            domain.match(/pornhub\.(ru|com|org)$/) !== null ||
            domain.match(/phncdn\.(ru|com|org)$/) !== null
        );
    }

    public static isSegmentsInfoRequest(url: URL): boolean {
        return (
            this.isValidDomain(url.hostname) &&
            url.pathname.match(/.*[^master]\.m3u8/) !== null
        );
    }

}