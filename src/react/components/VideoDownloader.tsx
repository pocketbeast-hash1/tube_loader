import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import { getVideo } from "../../content/get-video";
import IDownloadInfo from "../../interfaces/IDownloadInfo";
import VideoData from "./VideoData";

import "../styles/VideoDownloader";

interface IVideoDownloaderProps {
    parentId: number
};

const VideoDownloader = ({ parentId }: IVideoDownloaderProps) => {
    const [downloadInfo, setDownloadInfo] = useState<IDownloadInfo>();
    const [loadedSegments, setLoadedSegments] = useState<number>(0);
    
    useEffect(() => {
        const updateDownloadInfo = async () => {
            const info = await StoreController.getDownloadInfo(parentId);
            setDownloadInfo(info);
        };

        const removeRedirect = async () => {
            const window: chrome.windows.Window = await chrome.windows.getCurrent();

            if (window.id) {
                await StoreController.deleteWindowRedirect(window.id);
            }
        };

        const initApp = async () => {
            await updateDownloadInfo();
            await removeRedirect();
        };

        initApp();

    }, []);

    const getProgress = (): number => {
        if (downloadInfo && downloadInfo.segmentsInfo.segments.length > 0) {
            return (loadedSegments / downloadInfo.segmentsInfo.segments.length) * 100;
        }

        return 100
    };

    const startDownload = async (onComplete?: Function | undefined): Promise<void> => {
        if (downloadInfo) {
            console.log("start getting file!");
            const video: File | undefined = await getVideo(downloadInfo.baseUrl, downloadInfo.segmentsInfo, {
                onLoadSegment: (segmentNumber) => { setLoadedSegments(segmentNumber) },
                onError: () => { alert("error!"); }
            });

            if (!video) return;

            const videoUrl = URL.createObjectURL(video);
            await chrome.downloads.download({ url: videoUrl });

            if (onComplete)
                onComplete();
        }
    };

    const onCompleteDownload = async () => {
        await StoreController.deleteDownloadInfo(parentId);
        // TODO message about download delete to interface
        
        const window: chrome.windows.Window = await chrome.windows.getCurrent();
        if (window.id) {
            chrome.windows.remove(window.id);
        }
    };

    return (
        <div id="download-page">
            <h1>Download Page</h1>

            <VideoData 
                title={downloadInfo?.videoInfo?.title || ""}
                author_name={downloadInfo?.videoInfo?.author_name || ""}
                duration={downloadInfo?.videoInfo?.duration || 0}
                thumbnail_url={downloadInfo?.videoInfo?.thumbnail_url}
            />

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