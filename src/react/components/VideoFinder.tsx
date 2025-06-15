import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import SegmentsInfo from "../../classes/SegmentsInfo";
import * as serviceInitializer from "../../controllers/service-initializer";
import EServices from "../../enums/EServices";
import RuntimeMessage from "../../types/runtime-message";

import "../styles/VideoFinder";

const VideoFinder = () => {
    const [tabDomain, setTabDomain] = useState<string>("");
    const [segmentsInfo, setSegmentsInfo] = useState<SegmentsInfo>();
    const [baseUrl, setBaseUrl] = useState<string>("");
    
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

    useEffect(() => {
    
        const initApp = async () => {
            await updateTabDomain();
            await updateSegmentsInfo();
            await updateBaseUrl();
        };

        initApp();

    }, []);

    chrome.runtime.onMessage.addListener(async (message: RuntimeMessage, sender, sendResponse) => {
        
        if (message.id === "baseUrlUpdate") {
            updateBaseUrl();
        } else if (message.id === "segmentsInfoUpdate") {
            updateSegmentsInfo();
        }

    });

    const validDomain = (domain: string): boolean => {
        return serviceInitializer.getService(domain) !== EServices.Undefined;
    };

    const goToFile = async () => {
        if (baseUrl && segmentsInfo) {
                        
            const window = await chrome.windows.create({
                url: "/index.html",
                type: "popup",
                width: 300,
                height: 180
            });

            if (window.id) {
                await StoreController.setWindowRedirect(window.id, "/download-page");
            }

        }
    };

    const reloadTab = async () => {
        const tabs = await chrome.tabs.query({active: true});
        if (tabs.length <= 0) return;

        const tab: chrome.tabs.Tab = tabs[0];
        if (!tab.id) return;

        await chrome.tabs.reload(tab.id);
    };

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            
            <div
                id="tab-domain"
                className={validDomain(tabDomain) ? "valid" : "not-valid"}
            >
                Tab domain: {tabDomain}
            </div>
            {!validDomain(tabDomain) &&
                <div className="error-block">
                    This domain is not supported!
                </div>
            }
            
            {(validDomain(tabDomain) && baseUrl && segmentsInfo) &&
                <button
                    id="go-to-file"
                    className="btn"
                    onClick={goToFile}
                >Go to file!</button>
            }
            {(validDomain(tabDomain) && (!baseUrl || !segmentsInfo)) &&
                <>
                    <div className="error-block">Video was not found! Try to:</div>
                    <button
                        id="reload"
                        className="btn"
                        onClick={reloadTab}
                    >Reload</button>
                </>
            }
        </div>
    );
}
 
export default VideoFinder;