import EServices from "../enums/EServices";
import ManifestRequest from "../classes/abstract/ManifestRequest";
import ManifestRequestRutube from "../classes/rutube/ManifestRequestRutube";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import VideoInfoRequestRutube from "../classes/rutube/VideoInfoRequestRutube";
import IVideoInfo from "../interfaces/IVideoInfo";
import VideoInfoRutube from "../classes/rutube/VideoInfoRutube";

// GET SERVICE //
export const getService = (domain: string): EServices => {
    if (ManifestRequestRutube.isValidDomain(domain)) {
        return EServices.Rutube;
    }
    
    return EServices.Undefined;
};


// SEGMENTS INFO //
export const isSegmentsInfoRequest = (url: URL): boolean => {
    return (
        ManifestRequestRutube.isSegmentsInfoRequest(url)
    );
};
export const getSegmentsInfoRequest = (url: URL, service: EServices): ManifestRequest | undefined => {
    if (service === EServices.Rutube) {
        return new ManifestRequestRutube(url);
    }
};


// VIDEO ID FROM LINK //
export const getVideoIdFromLink = (link: string, service: EServices): string | undefined => {
    if (service === EServices.Rutube) {
        return VideoInfoRequestRutube.getVideoIdFromLink(link);
    }
};
export const getVideoInfoRequest = (videoId: string, service: EServices): VideoInfoRequest | undefined => {
    if (service === EServices.Rutube) {
        return new VideoInfoRequestRutube(videoId);
    }
};
export const getVideoInfoFromObject = (obj: Object, service: EServices): IVideoInfo | undefined => {
    if (service === EServices.Rutube) {
        return VideoInfoRutube.fromObject(obj);
    }
};