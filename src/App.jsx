import ZoomVideo from "@zoom/videosdk";
import { message } from "antd";
import { useContext, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import { MediaContext } from "./context/MediaContext";
import { ZoomContext } from "./context/ZoomContext";
import { VideoContainer } from "./feature/video/Video";

function App({ meetingArgs }) {
  const { sdkKey, topic, token, name, password } = meetingArgs;

  useEffect(() => {
    console.log("Meeting Args", meetingArgs);
  }, []);

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [mediaStream, setMediaStream] = useState();
  const [status, setStatus] = useState(false);

  const client = useContext(ZoomContext);

  useEffect(() => {
    const init = async () => {
      client.init("US-EN", "CDN");

      try {
        await client.join(topic, token, name, password);
        // client.join("topic", "token", "username","sessionPassword")
        const stream = client.getMediaStream();
        setMediaStream(stream);
        setLoading(false);
      } catch (error) {
        console.log("Erro joining meeting", error);
        setLoading(false);
        message.error(error.reason);
      }
    };
    init();
    return () => ZoomVideo.destroyClient();
  }, [sdkKey, topic, token, name, password, client]);

  return (
    <div className="App">
      {loading && <div className="loading">{loadingText}</div>}
      {!loading && (
        <MediaContext.Provider value={mediaStream}>
          <Router>
            <Routes>
              <Route exact path="/" element={<>Welcome</>} />
              <Route path="/video" element={<VideoContainer />} />
            </Routes>
          </Router>
        </MediaContext.Provider>
      )}
    </div>
  );
}

export default App;
