type GetVideoOptions = {
    onLoadSegment?(segmentNumber: number): void,
    onError?(): void
};

export default GetVideoOptions;