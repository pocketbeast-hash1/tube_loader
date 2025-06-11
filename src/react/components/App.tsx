import { useEffect, useState } from "react";
import StoreController from "../../controllers/store-controller";

const App = () => {
    const [tabDomain, setTabDomain] = useState<string>("");

    useEffect(() => {
        const updateTabDomain = async () => {
            const url: URL | undefined = await StoreController.getURL();
            setTabDomain(url?.hostname || "");
        };

        updateTabDomain();

    }, []);

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            <p>Hello world!</p>
            <p>Tab domain: {tabDomain}</p>
        </div>
    );
}
 
export default App;