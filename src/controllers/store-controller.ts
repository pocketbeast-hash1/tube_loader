import IDownloadInfo from "../interfaces/IDownloadInfo";
import DownloadInfo from "../classes/DownloadInfo";
import IRedirectMessage from "../interfaces/IRedirectMessage";
import ITabInfo from "../interfaces/ITabInfo";

export default class StoreController {
    
    private static async getValueByKey(key: string): Promise<any | undefined> {
        const obj: { [key]: string } = await chrome.storage.session.get(key);
        return obj[key];
    }
    private static async setValueByKey(key: string, value: string | number): Promise<void> {
        await chrome.storage.session.set({ [key]: value });
    }
    private static async deleteValueByKey(key: string): Promise<void> {
        await chrome.storage.session.remove(key);
    }
    public static async clearStore(): Promise<void> {
        await chrome.storage.session.clear();
    }


    public static async getCurrentTabInfo(): Promise<ITabInfo | undefined> {
        const tabInfoStr: string = await StoreController.getValueByKey("currentTabInfo");
        if (tabInfoStr && tabInfoStr.length > 0) {
            const tabInfo = JSON.parse(tabInfoStr);
            return tabInfo;
        }
    }
    public static async setCurrentTabInfo(tabInfo: ITabInfo): Promise<void> {
        await StoreController.setValueByKey("currentTabInfo",  JSON.stringify(tabInfo) );
    }


    public static async getDownloadInfo(tabId: number): Promise<IDownloadInfo | undefined> {
        const info: string | undefined = await StoreController.getValueByKey(`i${tabId}`);
        if (info && info.length > 0) {
            const obj: IDownloadInfo = JSON.parse(info);
            return new DownloadInfo(obj);
        }
        
        return undefined;
    }
    public static async setDownloadInfo(tabId: number, downloadInfo: IDownloadInfo): Promise<void> {
        await StoreController.setValueByKey(`i${tabId}`, JSON.stringify(downloadInfo));
    }
    public static async deleteDownloadInfo(tabId: number): Promise<void> {
        await StoreController.deleteValueByKey(`i${tabId}`);
    }


    public static async getWindowRedirect(windowId: number): Promise<IRedirectMessage | undefined> {
        const message: string | undefined = await StoreController.getValueByKey(`r${windowId}`);
        console.log(windowId, "message window id");
        console.log(message, "message");
        if (message && message.length > 0) {
            return JSON.parse(message);
        }
    }
    public static async setWindowRedirect(windowId: number, message: IRedirectMessage): Promise<void> {
        await StoreController.setValueByKey(`r${windowId}`, JSON.stringify(message));
    }
    public static async deleteWindowRedirect(windowId: number): Promise<void> {
        await StoreController.deleteValueByKey(`r${windowId}`);
    }

}