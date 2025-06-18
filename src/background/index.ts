import RequestsController from "../controllers/requests-controller";
import StoreController from "../controllers/store-controller";
import EServices from "../enums/EServices";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import * as serviceInitializer from "../controllers/service-initializer";
import DownloadInfo from "../classes/DownloadInfo";
import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import IRuntimeMessage from "../interfaces/IRuntimeMessage";
import ITabInfo from "../interfaces/ITabInfo";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import IVideoInfo from "../interfaces/IVideoInfo";

chrome.tabs.onActivated.addListener(async tabInfo => {
    chrome.webRequest.onCompleted.removeListener(listenWebRequests);
    startListeningActiveTab();
});

const startListeningActiveTab = () => {
    chrome.tabs.query({ active: true }, async (tabs) => {

        const tab: chrome.tabs.Tab = tabs[0];
        if (!tab || !tab.id || !tab.url) return;

        const tabInfo: ITabInfo = { id: tab.id, url: tab.url };
        await StoreController.setCurrentTabInfo(tabInfo);

        chrome.webRequest.onCompleted.addListener(
            listenWebRequests, 
            { 
                urls: ["http://*/*", "https://*/*"],
                tabId: tab.id 
            }
        );

    });
};

const listenWebRequests = async (details: chrome.webRequest.OnCompletedDetails) => {
    
    if (details.method !== "GET") return;

    const url: URL = new URL(details.url);
    const service: EServices = serviceInitializer.getService(url.hostname);
    if (service === EServices.Undefined) return;
    if (!serviceInitializer.isSegmentsInfoRequest(url)) return;
    
    const segmentsInfoRequest: SegmentsInfoRequest | undefined = 
        serviceInitializer.getSegmentsInfoRequest(url, service);
    if (!segmentsInfoRequest) return;

    const segmentsInfo: ISegmentsInfo | undefined = await RequestsController.getSegmentsInfo(segmentsInfoRequest);
    if (!segmentsInfo) return;
    
    const tab: ITabInfo | undefined = await StoreController.getCurrentTabInfo();
    if (!tab) return;

    const videoId: string | undefined = serviceInitializer.getVideoIdFromLink(tab.url, service);
    const videoInfoRequest: VideoInfoRequest | undefined = 
        serviceInitializer.getVideoInfoRequest(videoId || "", service);    
    
    let videoInfo: IVideoInfo | undefined = undefined;
    if (videoInfoRequest) {
        videoInfo = await RequestsController.getVideoInfo(videoInfoRequest);
    }

    const downloadInfo: DownloadInfo = new DownloadInfo({
        service: service,
        tabUrl: tab.url || "",
        baseUrl: segmentsInfoRequest.baseUrl,
        segmentsInfo: segmentsInfo,
        videoInfo: videoInfo
    });

    await StoreController.setDownloadInfo(tab.id, downloadInfo);

    const msgToClient: IRuntimeMessage = { id: "updateDownloadInfo" };
    chrome.runtime.sendMessage(msgToClient);

};