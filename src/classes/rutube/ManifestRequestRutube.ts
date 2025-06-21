import EServices from "../../enums/EServices";
import ManifestRequest from "../abstract/ManifestRequest";

export default class ManifestRequestRutube extends ManifestRequest {
    
    public readonly service: EServices = EServices.Rutube;
    
    public static isValidDomain(domain: string): boolean {
        return (
            domain.match(/^rutube\.ru$/) !== null ||
            domain.match(/.*[^bl]\.rutube\.ru*/) !== null ||
            domain.match(/.*[^bl]\.rtbcdn\.ru*/) !== null
        );
    }

}