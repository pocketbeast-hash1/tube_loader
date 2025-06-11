import { useState, useEffect } from "react";

const App = () => {
    const [value, setValue] = useState<string>("place!");

    const setValueFromStorage = async (key: string): Promise<void> => {
        const obj: Object = await chrome.storage.session.get(key);
        const v = obj[key];
        setValue(v);
    };

    useEffect(() => {
        setValueFromStorage("testKey");
    }, []);

    return (
        <div className="main-app">
            <h1>Tube Loader</h1>
            <p>Hello {value}</p>
        </div>
    );
}
 
export default App;