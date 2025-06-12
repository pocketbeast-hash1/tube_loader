// TODO refactor

import RequestsController from "../controllers/requests-controller";
import StoreController from "../controllers/store-controller";
import EServices from "../enums/EServices";
import SegmentsInfoRequest from "../types/abstract/SegmentsInfoRequest";
import SegmentsInfoRequestRutube from "../types/SegmentsInfoRequestRutube";

chrome.tabs.onActivated.addListener(async tabInfo => {
    await StoreController.clearStore();
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
    const service: EServices = getService(url.hostname);
    if (service === EServices.Undefined) return;
    if (!isSegmentsInfoRequest(url)) return;
    
    const segmentsInfoRequest: SegmentsInfoRequest | undefined = 
        getSegmentsInfoRequest(url, service);
    if (!segmentsInfoRequest) return;

    await StoreController.setBaseURL(segmentsInfoRequest.baseUrl);

    const segmentsInfo: string | undefined = await RequestsController.getSegmentsInfo(segmentsInfoRequest);
    if (!segmentsInfo) return;
    await StoreController.setSegmentsInfo(segmentsInfo);

};

const getService = (domain: string): EServices => {
    if (SegmentsInfoRequestRutube.isValidDomain(domain)) {
        return EServices.Rutube;
    }
    
    return EServices.Undefined;
};

const isSegmentsInfoRequest = (url: URL): boolean => {
    return (
        SegmentsInfoRequestRutube.isSegmentsInfoRequest(url)
    );
};

const getSegmentsInfoRequest = (url: URL, service: EServices): SegmentsInfoRequest | undefined => {
    if (service === EServices.Rutube) {
        return new SegmentsInfoRequestRutube(url);
    };
};