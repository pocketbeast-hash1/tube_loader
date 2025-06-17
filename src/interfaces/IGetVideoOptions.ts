export default interface IGetVideoOptions {
    onLoadSegment?: (segmentNumber: number) => void;
    onError?: () => void;
};