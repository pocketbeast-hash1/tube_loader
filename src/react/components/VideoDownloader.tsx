import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import SegmentsInfo from "../../classes/SegmentsInfo";
import { getVideo } from "../../content/get-video";

const VideoDownloader = () => {
    const [segmentsInfo, setSegmentsInfo] = useState<SegmentsInfo>();
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [loadedSegments, setLoadedSegments] = useState<number>(0);
    
    useEffect(() => {
        const updateSegmentsInfo = async () => {
            const segmentsInfo: SegmentsInfo | undefined = await StoreController.getSegmentsInfo();
            setSegmentsInfo(segmentsInfo);
        };

        const updateBaseUrl = async () => {
            const bUrl: string | undefined = await StoreController.getBaseURL();
            setBaseUrl(bUrl || "");
        };

        const initApp = () => {
            updateSegmentsInfo();
            updateBaseUrl();
        };

        initApp();

    }, []);

    const startDownload = async (onComplete: Function) => {
        console.log(baseUrl, segmentsInfo);
        if (baseUrl && segmentsInfo) {
            console.log("start getting file!");
            const video: File | undefined = await getVideo(baseUrl, segmentsInfo, {
                onLoadSegment: (segmentNumber) => { setLoadedSegments(segmentNumber) },
                onError: () => { alert("error!"); }
            });

            if (!video) return;

            const videoUrl = URL.createObjectURL(video);
            await chrome.downloads.download({ url: videoUrl });

            onComplete();
        }
    };

    const onCompleteDownload = async () => {
        const window: chrome.windows.Window = await chrome.windows.getCurrent();

        if (window.id) {
            StoreController.deleteWindowRedirect(window.id);
            chrome.windows.remove(window.id);
        }
    };
    
    return (
        <div className="download-page">
            <h1>Download Page</h1>
            <p>Segments count: { segmentsInfo?.segments.length || 0 }</p>
            <p>Progress: {loadedSegments}/{ segmentsInfo?.segments.length || 0 }</p>
            <button
                onClick={() => startDownload(onCompleteDownload)}
            >Start Download</button>
        </div>
    );
}
 
export default VideoDownloader;