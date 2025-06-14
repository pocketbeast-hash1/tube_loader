import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import SegmentsInfo from "../../classes/SegmentsInfo";
import { useNavigate } from "react-router-dom";

const VideoFinder = () => {
    const [tabDomain, setTabDomain] = useState<string>("");
    const [segmentsInfo, setSegmentsInfo] = useState<SegmentsInfo>();
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [loadedSegments, setLoadedSegments] = useState<number>(0);

    const navigate = useNavigate();
    
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

        const checkRedirect = async () => {
            const window: chrome.windows.Window = await chrome.windows.getCurrent();
            if (window.id) {
                const redirect = await StoreController.getWindowRedirect(window.id);
                if (redirect) {
                    // TODO resolve problem, when throws errors with redirect
                    navigate(redirect);
                };
            };
        };

        const initApp = async () => {
            await updateTabDomain();
            await updateSegmentsInfo();
            await updateBaseUrl();

            await checkRedirect();
        };

        initApp();

    }, []);

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            <p>Hello world!</p>
            <p>Tab domain: {tabDomain}</p>
            <p>Segments count: { segmentsInfo?.segments.length || 0 }</p>
            <p>Progress: {loadedSegments}/{ segmentsInfo?.segments.length || 0 }</p>
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