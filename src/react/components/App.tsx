import VideoFinder from "./VideoFinder";
import VideoDownloader from "./VideoDownloader";
import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";
import IRedirectMessage from "../../interfaces/IRedirectMessage";

const App = () => {
    const [path, setPath] = useState<string>("");
    const [parentId, setParentId] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const checkRedirect = async () => {
            const window: chrome.windows.Window = await chrome.windows.getCurrent();
            if (!window.id) return;

            const redirect: IRedirectMessage | undefined = await StoreController.getWindowRedirect(window.id);
            if (!redirect) return;

            setPath(redirect.to);
            setParentId(redirect.parentId);
        };

        const initApp = async () => {
            await checkRedirect();
            setIsLoading(false);
        };

        initApp();

    }, []);

    if (!isLoading) {

        if (!path || path === "/index.html") return <VideoFinder />;
        else if (path === "/download-page") return <VideoDownloader parentId={parentId} />;

    }
}
 
export default App;