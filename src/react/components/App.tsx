import { Routes, Route } from "react-router-dom";
import VideoFinder from "./VideoFinder";
import VideoDownloader from "./VideoDownloader";

const App = () => {
    return (
        <Routes>

            <Route path="/index.html" element={<VideoFinder />} />
            <Route path="/download-page" element={<VideoDownloader />} />

        </Routes>
    );
}
 
export default App;