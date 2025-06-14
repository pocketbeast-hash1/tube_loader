export default abstract class SegmentsInfoRequest {

    public baseUrl: string;
    public hash?: string;
    public expired?: number;
    public resolution?: string;

    constructor(url: URL) {
        this.baseUrl = "";
    }

    public static isValidDomain(domain: string): boolean {
        return false;
    }

    public static isSegmentsInfoRequest(url: URL): boolean {
        return false;
    }

    public toString(): string {
        return "";
    }

}