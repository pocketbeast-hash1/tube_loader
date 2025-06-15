import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import SegmentsInfo from "../../classes/SegmentsInfo";

const VideoFinder = () => {
    const [tabDomain, setTabDomain] = useState<string>("");
    const [segmentsInfo, setSegmentsInfo] = useState<SegmentsInfo>();
    const [baseUrl, setBaseUrl] = useState<string>("");
    
    useEffect(() => {
        const updateTabDomain = async () => {
            const url: URL | undefined = await StoreController.getURL();
            setTabDomain(url?.hostname || "");
        };

        const updateSegmentsInfo = async () => {
            const segmentsInfo: SegmentsInfo | undefined = await StoreController.getSegmentsInfo();
            setSegmentsInfo(segmentsInfo);
        };

        const updateBaseUrl = async () => {
            const bUrl: string | undefined = await StoreController.getBaseURL();
            setBaseUrl(bUrl || "");
        };

        const initApp = async () => {
            await updateTabDomain();
            await updateSegmentsInfo();
            await updateBaseUrl();
        };

        initApp();

    }, []);

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            <p>Hello world!</p>
            <p>Tab domain: {tabDomain}</p>
            <p>Segments count: { segmentsInfo?.segments.length || 0 }</p>
            <button 
                onClick={async () => {
                    if (baseUrl && segmentsInfo) {
                        
                        const window = await chrome.windows.create({
                            url: "/index.html",
                            type: "popup"
                        });

                        if (window.id) {
                            await StoreController.setWindowRedirect(window.id, "/download-page");
                        }

                    }
                }}
                disabled={!baseUrl && !segmentsInfo}
            >Go to file!</button>
        </div>
    );
}
 
export default VideoFinder;