// TODO refactor

import RequestsController from "../controllers/requests-controller";
import StoreController from "../controllers/store-controller";
import EServices from "../enums/EServices";
import SegmentsInfoRequest from "../classes/abstract/SegmentsInfoRequest";
import * as serviceInitializer from "../controllers/service-initializer";
import RuntimeMessage from "../types/runtime-message";

chrome.tabs.onActivated.addListener(async tabInfo => {
    chrome.webRequest.onCompleted.removeListener(listenWebRequests);
    startListeningActiveTab();
});

const startListeningActiveTab = () => {
    chrome.tabs.query({ active: true }, async (tabs) => {

        const tab: chrome.tabs.Tab = tabs[0];
        if (!tab) return;

        await StoreController.setURL(tab.url || "");
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

    let msgToClient: RuntimeMessage;

    await StoreController.setBaseURL(segmentsInfoRequest.baseUrl);

    msgToClient = { id: "baseUrlUpdate" };
    chrome.runtime.sendMessage(msgToClient);

    const segmentsInfo: string | undefined = await RequestsController.getSegmentsInfo(segmentsInfoRequest);
    if (!segmentsInfo) return;
    await StoreController.setSegmentsInfo(segmentsInfo);
    
    msgToClient = { id: "segmentsInfoUpdate" };
    chrome.runtime.sendMessage(msgToClient);

};