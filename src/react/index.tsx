import { createRoot } from "react-dom/client";

import App from './components/App';

const root: HTMLElement | null = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <App />
    );
}