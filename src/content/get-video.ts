import RequestsController from "../controllers/requests-controller";
import SegmentsInfo from "../classes/SegmentsInfo";
import GetVideoOptions from "../types/get-video-options";

export const getVideo = async (baseUrl: string, segmentsInfo: SegmentsInfo, options: GetVideoOptions | undefined = undefined): Promise<File | undefined> => {

    const bins = new Array<BlobPart>;
    for (let segment of segmentsInfo.segments) {
        const bin: BlobPart | undefined = await RequestsController.getSegment(baseUrl, segment);
        if (bin) {
            bins.push(bin);
            if (options?.onLoadSegment !== undefined) {
                options.onLoadSegment(segment.num);
            }
        }
    }

    if (bins.length === 0) {
        if (options?.onError !== undefined) {
            options.onError();
        }
        return;
    }

    return new File(bins, "test", { type: "video/mp4" });
    
};