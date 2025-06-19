import EServices from "../../enums/EServices";
import ManifestRequest from "../abstract/ManifestRequest";

export default class ManifestRequestRutube extends ManifestRequest {
    
    public readonly service: EServices = EServices.Rutube;
    public readonly manifestUrl: string;
    public readonly baseUrl: string;

    constructor(url: URL) {
        super(url);
        this.manifestUrl = url.href;

        const pathParts = url.pathname.split("/");
        pathParts.pop();

        this.baseUrl = url.protocol + "//" + url.hostname + pathParts.join("/");
    }

    public static isValidDomain(domain: string): boolean {
        return (
            domain.match(/^rutube\.ru$/) !== null ||
            domain.match(/.*[^bl]\.rutube\.ru*/) !== null ||
            domain.match(/.*[^bl]\.rtbcdn\.ru*/) !== null
        );
    }

}