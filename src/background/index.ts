import RequestsController from "../controllers/requests-controller";
import StoreController from "../controllers/store-controller";
import EServices from "../enums/EServices";
import ManifestRequest from "../classes/abstract/ManifestRequest";
import * as serviceInitializer from "../controllers/service-initializer";
import DownloadInfo from "../classes/DownloadInfo";
import IRuntimeMessage from "../interfaces/IRuntimeMessage";
import ITabInfo from "../interfaces/ITabInfo";
import VideoInfoRequest from "../classes/abstract/VideoInfoRequest";
import IVideoInfo from "../interfaces/IVideoInfo";
import { Manifest } from "m3u8-parser";

const handleOnActivated = (tabInfo: chrome.tabs.TabActiveInfo) => {
    startListeningActiveTab();
};

const handleOnUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    StoreController.deleteDownloadInfo(tabId);
    startListeningActiveTab();
};

if (!chrome.tabs.onActivated.hasListener(handleOnActivated))
    chrome.tabs.onActivated.addListener(handleOnActivated);

if (!chrome.tabs.onUpdated.hasListener(handleOnUpdated))
    chrome.tabs.onUpdated.addListener(handleOnUpdated);


const startListeningActiveTab = async () => {
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true });

    const tab: chrome.tabs.Tab = tabs[0];
    if (!tab || !tab.id || !tab.url) return;

    const tabInfo: ITabInfo = { id: tab.id, url: tab.url };
    await StoreController.setCurrentTabInfo(tabInfo);

    if (!chrome.webRequest.onCompleted.hasListener(listenWebRequests)) {
        chrome.webRequest.onCompleted.addListener(
            listenWebRequests, 
            { 
                urls: ["http://*/*", "https://*/*"],
                tabId: tab.id 
            }
        );
    }
};

const listenWebRequests = async (details: chrome.webRequest.OnCompletedDetails) => {
    
    if (details.method !== "GET") return;

    const url: URL = new URL(details.url);
    const service: EServices = serviceInitializer.getService(url.hostname);
    if (service === EServices.Undefined) return;
    if (!serviceInitializer.isSegmentsInfoRequest(url)) return;
    
    const segmentsInfoRequest: ManifestRequest | undefined = 
        serviceInitializer.getSegmentsInfoRequest(url, service);
    if (!segmentsInfoRequest) return;

    const manifest: Manifest | undefined = await RequestsController.getManifest(segmentsInfoRequest);
    if (!manifest || manifest.segments.length <= 0) return;

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
        manifest: manifest,
        videoInfo: videoInfo
    });

    await StoreController.setDownloadInfo(tab.id, downloadInfo);

    const msgToClient: IRuntimeMessage = { id: "updateDownloadInfo" };
    chrome.runtime
        .sendMessage(msgToClient)
        .catch(error => {
            // Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
            // error appears because of multiple triggers of listener
            // and message don't handle
            // no need to worry
            // it's ok
            // ...
            // TODO refactor
        });

};