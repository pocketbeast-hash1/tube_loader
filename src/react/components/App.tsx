import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";

const App = () => {
    const [tabDomain, setTabDomain] = useState<string>("");
    const [segmentsCount, setSegmentsCount] = useState<number>(0);

    useEffect(() => {
        const updateTabDomain = async () => {
            const url: URL | undefined = await StoreController.getURL();
            setTabDomain(url?.hostname || "");
        };

        const updateSegmentsCount = async () => {
            const segmentsInfo = await StoreController.getSegmentsInfo();
            setSegmentsCount(segmentsInfo?.segments.length || 0);
        };

        updateTabDomain();
        updateSegmentsCount();

    }, []);

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            <p>Hello world!</p>
            <p>Tab domain: {tabDomain}</p>
            <p>Segments count: {segmentsCount}</p>
        </div>
    );
}
 
export default App;