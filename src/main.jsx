import ZoomVideo from "@zoom/videosdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ZoomContext } from "./context/ZoomContext.jsx";
import { config } from "./devConfig.js";
import "./index.css";

let meetingArgs = { ...config };

const getToken = async (options) => {
  // get request to your server to get token from the endpoint /generate
  const token = await fetch(`/generate`, options).then((response) =>
    response.json()
  );

  return token;
};

// check if there's a signature and topic in the meetingArgs
if (!meetingArgs.signature && meetingArgs.topic) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meetingArgs }),
  };

  getToken(requestOptions).then(
    (response) => (meetingArgs.signature = response)
  );
}

const client = ZoomVideo.createClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ZoomContext.Provider value={client}>
      <App meetingArgs={meetingArgs} />
    </ZoomContext.Provider>
  </StrictMode>
);
