import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";
import GlobalStore from "./store/globalStore";

import App from './components/App';

const stores: {} = {
    globalStore: new GlobalStore()
}

const root: HTMLElement | null = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <Provider {...stores}>
            <App />
        </Provider>
    );
}