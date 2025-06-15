import VideoFinder from "./VideoFinder";
import VideoDownloader from "./VideoDownloader";
import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";

const App = () => {
    const [path, setPath] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const checkRedirect = async () => {
            const window: chrome.windows.Window = await chrome.windows.getCurrent();
            if (!window.id) return;

            const redirect: string | undefined = await StoreController.getWindowRedirect(window.id);
            if (!redirect) return;

            setPath(redirect);
        };

        const initApp = async () => {
            await checkRedirect();
            setIsLoading(false);
        };

        initApp();

    }, []);

    if (!isLoading) {

        if (!path || path === "/index.html") return <VideoFinder />;
        else if (path === "/download-page") return <VideoDownloader />;

    }
}
 
export default App;