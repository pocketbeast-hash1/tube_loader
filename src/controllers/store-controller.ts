import ISegmentsInfo from "../interfaces/ISegmentsInfo";
import SegmentsInfo from "../types/SegmentsInfo";

export default class StoreController {
    
    private static async getValueByKey(key: string): Promise<any | undefined> {
        const obj: { [key]: string } = await chrome.storage.session.get(key);
        return obj[key];
    }
    private static async setValueByKey(key: string, value: any): Promise<void> {
        await chrome.storage.session.set({ [key]: value });
    }
    public static async clearStore(): Promise<void> {
        await chrome.storage.session.clear();
    }


    public static async getURL(): Promise<URL | undefined> {
        const url: string | undefined = await StoreController.getValueByKey("url");
        if (url) {
            return new URL(url);
        } else {
            return undefined;
        }
    }
    public static async setURL(newURL: string): Promise<void> {
        await StoreController.setValueByKey("url", newURL);
    }


    public static async getBaseURL(): Promise<string | undefined> {
        return await StoreController.getValueByKey("baseUrl");
    }
    public static async setBaseURL(baseUrl: string): Promise<void> {
        await StoreController.setValueByKey("baseUrl", baseUrl);
    }


    public static async getSegmentsInfo(): Promise<ISegmentsInfo | undefined> {
        const info: string = await StoreController.getValueByKey("segmentsInfo");
        if (info) {
            return new SegmentsInfo(info);
        } else {
            return undefined;
        }
    }
    public static async setSegmentsInfo(info: string): Promise<void> {
        await StoreController.setValueByKey("segmentsInfo", info);
    }

}