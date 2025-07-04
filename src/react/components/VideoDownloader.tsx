import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import { getVideo } from "../../controllers/get-video";
import IDownloadInfo from "../../interfaces/IDownloadInfo";
import VideoData from "./VideoData";
import { getValidName } from "../../controllers/naming-controller";

import "../styles/VideoDownloader";
import IRuntimeMessage from "../../interfaces/IRuntimeMessage";

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
        if (downloadInfo && downloadInfo.manifest && downloadInfo.manifest.segments.length > 0) {
            return (loadedSegments / downloadInfo.manifest.segments.length) * 100;
        }

        return 100
    };

    const startDownload = async (onComplete?: Function | undefined): Promise<void> => {
        if (downloadInfo && downloadInfo.manifest) {
            const video: File | undefined = await getVideo(downloadInfo.baseUrl, downloadInfo.manifest, {
                onLoadSegment: (segmentNumber) => { setLoadedSegments(segmentNumber) },
                onError: () => { alert("error!"); }
            });

            if (!video) return;

            const videoUrl: string = URL.createObjectURL(video);

            let videoName: string = "video";
            if (downloadInfo.videoInfo?.title) {
                videoName = getValidName(downloadInfo.videoInfo?.title);
            }

            const filename: string = videoName + ".mp4";

            await chrome.downloads.download({ url: videoUrl, filename });

            if (onComplete)
                onComplete();
        }
    };

    const onCompleteDownload = async () => {
        await StoreController.deleteDownloadInfo(parentId);
        
        const msg: IRuntimeMessage = { id: "updateDownloadInfo" };
        chrome.runtime.sendMessage(msg);
        
        const window: chrome.windows.Window = await chrome.windows.getCurrent();
        if (window.id) {
            chrome.windows.remove(window.id);
        }
    };

    return (
        <div id="download-page">
            <h1>Download Page. Don't close it!</h1>

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