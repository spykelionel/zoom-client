import { useContext, useState } from "react";
import { MediaContext } from "../../context/MediaContext";
import { ZoomContext } from "../../context/ZoomContext";

export const VideoContainer = () => {
  const [videoStarted, setVideoStarted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSharedScreen, setIsSharedScreen] = useState(false);
  const [isSAB, setIsSAB] = useState(false);

  const client = useContext(ZoomContext);
  const mediaStream = useContext(MediaContext);

  const isSupportedWebCodecs = () => {
    return typeof window.MediaStreamTrackProcessor === "function";
  };

  const startVideoButton = useCallback(async () => {
    if (videoStarted) {
      if (!!window.chrome && !(typeof SharedArrayBuffer === "function")) {
        setIsSAB(false);
        await mediaStream.startVideo({
          videoElement: document.querySelector("#self-view-video"),
        });
      } else {
        setIsSAB(true);
        await mediaStream.startVideo();
        mediaStream.renderVideo(
          document.querySelector("#self-view-canvas"),
          client.getCurrentUserInfo().userId,
          1920,
          1000,
          0,
          0,
          3
        );
      }
      setVideoStarted(true);
    } else {
      await mediaStream.stopVideo();
      if (isSAB) {
        mediaStream.stopRenderVideo(
          document.querySelector("#self-view-canvas"),
          client.getCurrentUserInfo().userId
        );
      }
    }
  }, [client, mediaStream, isSAB, videoStarted]);

  const StartAudioButton = useCallback(async () => {
    if (audioStarted) {
      if (isMuted) {
        await mediaStream.unmuteAudio();
        setIsMuted(false);
      } else {
        await mediaStream.muteAudio();
        setIsMuted(true);
      }
    } else {
      await mediaStream.startAudio();
      setAudioStarted(true);
    }
  }, [mediaStream, isMuted, audioStarted]);

  const shareScreen = useCallback(async () => {
    if (isSharedScreen) {
      await mediaStream.stopShareScreen();
      setIsSharedScreen(false);
    } else {
      if (isSupportedWebCodecs()) {
        mediaStream.startShareScreen();
        await mediaStream.startShareScreen(
          document.querySelector("#share-video")
        );
      } else {
        await mediaStream.startShareScreen(
          document.querySelector("#share-canvas")
        );
      }
      setIsSharedScreen(true);
    }
  }, [mediaStream, isSharedScreen]);

  return (
    <div>
      {isSAB ? (
        <canvas
          id="self-view-canvas"
          width={1920}
          height={1000}
          className="video-container"
        />
      ) : (
        <video
          width={1920}
          height={1000}
          id="self-view-video"
          className="video-container"
          muted={isMuted}
          autoPlay={true}
        />
      )}
      {isSupportedWebCodecs() ? (
        <canvas
          id="share-canvas"
          width={1920}
          height={1000}
          className="video-container"
        />
      ) : (
        <video
          width={1920}
          height={1000}
          id="share-video"
          className="video-container"
          muted={isMuted}
          autoPlay={true}
        />
      )}
      <div className="">
        <button onClick={startVideoButton}>Start or Stop Video</button>
        <button onClick={shareScreen}>Start or Stop Share Screen</button>
      </div>
      <div className="">
        <button onClick={StartAudioButton}>Mute or Unmute Audio</button>
      </div>
    </div>
  );
};
