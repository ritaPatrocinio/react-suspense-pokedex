import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(<App />); // Concurrent Mode
