import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import * as serviceInitializer from "../../controllers/service-initializer";
import EServices from "../../enums/EServices";
import IRedirectMessage from "../../interfaces/IRedirectMessage";
import IRuntimeMessage from "../../interfaces/IRuntimeMessage";
import IDownloadInfo from "../../interfaces/IDownloadInfo";

import "../styles/VideoFinder";
import ITabInfo from "../../interfaces/ITabInfo";

const VideoFinder = () => {
    
    const [tabDomain, setTabDomain] = useState<string>("");
    const [downloadInfo, setDownloadInfo] = useState<IDownloadInfo>();

    const updateDownloadInfo = async () => {
        const tab: ITabInfo | undefined = await StoreController.getCurrentTabInfo();
        if (tab) {
            const info: IDownloadInfo | undefined = await StoreController.getDownloadInfo(tab.id);

            if (!info) return;

            setDownloadInfo(info);
        }
    };

    useEffect(() => {
    
        const updateTabDomain = async () => {
            const tab: ITabInfo | undefined = await StoreController.getCurrentTabInfo();
            if (tab) {
                setTabDomain( new URL(tab.url).host );
            }
        };

        const initApp = async () => {
            await updateTabDomain();
            await updateDownloadInfo();
        };

        initApp();

    }, []);

    chrome.runtime.onMessage.addListener(async (message: IRuntimeMessage, sender, sendResponse) => {
        
        if (message.id === "updateDownloadInfo") {
            updateDownloadInfo();
        }

    });

    const validDomain = (domain: string): boolean => {
        return serviceInitializer.getService(domain) !== EServices.Undefined;
    };

    // TODO refactor
    const goToFile = async () => {
        if (downloadInfo) {

            const currentTab: ITabInfo | undefined = await StoreController.getCurrentTabInfo();
            const window = await chrome.windows.create({
                url: "/index.html",
                type: "popup",
                width: 400,
                height: 600
            });

            if (window.id && currentTab) {
                const redirectMessage: IRedirectMessage = {
                    to: "/download-page", 
                    parentId: currentTab.id
                };
                await StoreController.setWindowRedirect(window.id, redirectMessage);
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
                className={validDomain(tabDomain || "") ? "valid" : "not-valid"}
            >
                Tab domain: {tabDomain}
            </div>
            {!validDomain(tabDomain) &&
                <div className="error-block">
                    This domain is not supported!
                </div>
            }
            
            {(validDomain(tabDomain) && downloadInfo && downloadInfo.manifest) &&
                <button
                    id="go-to-file"
                    className="btn"
                    onClick={goToFile}
                >Go to file!</button>
            }
            {(validDomain(tabDomain) && (!downloadInfo || !downloadInfo.manifest)) &&
                <>
                    <div className="error-block">
                        {!downloadInfo && "Video was not found! Try to:"}
                        {downloadInfo && !downloadInfo.manifest && "Manifest was not found! Try to:"}
                    </div>
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