import GlobalContext from "./Context/GlobalContext.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GlobalContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalContext>
);
