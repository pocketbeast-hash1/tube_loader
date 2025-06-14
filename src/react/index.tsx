import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from './components/App';

const root: HTMLElement | null = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <Router>
                <App />
            </Router>
        </React.StrictMode>
    );
}