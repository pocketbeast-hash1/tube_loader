import EServices from "../enums/EServices";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import SegmentsInfoRequestRutube from "../classes/SegmentsInfoRequestRutube";

export const getService = (domain: string): EServices => {
    if (SegmentsInfoRequestRutube.isValidDomain(domain)) {
        return EServices.Rutube;
    }
    
    return EServices.Undefined;
};

export const isSegmentsInfoRequest = (url: URL): boolean => {
    return (
        SegmentsInfoRequestRutube.isSegmentsInfoRequest(url)
    );
};

export const getSegmentsInfoRequest = (url: URL, service: EServices): SegmentsInfoRequest | undefined => {
    if (service === EServices.Rutube) {
        return new SegmentsInfoRequestRutube(url);
    };
};