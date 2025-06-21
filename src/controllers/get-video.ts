import { Manifest, Segment } from "m3u8-parser";
import RequestsController from "../controllers/requests-controller";
import IGetVideoOptions from "../interfaces/IGetVideoOptions";

export const getVideo = async (baseUrl: string, manifest: Manifest, options: IGetVideoOptions | undefined = undefined): Promise<File | undefined> => {

    const bins = new Array<BlobPart>;
    for (let i = 0; i < manifest.segments.length - 1; i++) {
        const segment: Segment = manifest.segments[i];
        const bin: BlobPart | undefined = await RequestsController.getSegment(baseUrl, segment);
        if (bin) {
            bins.push(bin);
            if (options?.onLoadSegment !== undefined) {
                options.onLoadSegment(i + 1);
            }
        }
    }

    if (bins.length === 0) {
        if (options?.onError !== undefined) {
            options.onError();
        }
        return;
    }

    return new File(bins, "newFile", { type: "video/mp4" });
    
};