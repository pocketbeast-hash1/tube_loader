import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import SegmentsInfo from "../../classes/SegmentsInfo";
import { getVideo } from "../../content/get-video";

import "../styles/VideoDownloader";

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

    const getProgress = (): number => {
        if (!segmentsInfo?.segments || segmentsInfo.segments.length <= 0) return 100;
        return (loadedSegments / segmentsInfo.segments.length) * 100;
    };

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
        <div id="download-page">
            <h1>Download Page</h1>
            <div className="progress-bar wrapper">
                <div className="progress-bar content" style={{width: `${getProgress()}%`}}>
                </div>
            </div>
            <button
                onClick={() => startDownload(onCompleteDownload)}
            >Start Download</button>
        </div>
    );
}
 
export default VideoDownloader;