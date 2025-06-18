import EServices from "../enums/EServices";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import SegmentsInfoRequestRutube from "../classes/SegmentsInfoRequestRutube";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import VideoInfoRequestRutube from "../classes/VideoInfoRequestRutube";
import IVideoInfo from "../interfaces/IVideoInfo";
import VideoInfoRutube from "../classes/VideoInfoRutube";

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