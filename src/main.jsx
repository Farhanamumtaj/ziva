import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

import App from "./App";
import "./index.css";
import { app } from "./firebase";

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY
  ),
  isTokenAutoRefreshEnabled: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);