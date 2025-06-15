import { createRoot } from "react-dom/client";
import App from './components/App';

import "./styles/main";

const root: HTMLElement | null = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <App />
    );
}