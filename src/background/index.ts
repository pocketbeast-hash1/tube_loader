import StoreController from "../controllers/store-controller";

chrome.tabs.onActivated.addListener(tabInfo => {
    chrome.tabs.get(tabInfo.tabId, tab => {

        StoreController.setURL(tab.url || "");

    });
});