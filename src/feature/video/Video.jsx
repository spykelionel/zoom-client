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

  const startVideoButton = useCallback(() => {}, [
    client,
    mediaStream,
    isSAB,
    videoStarted,
  ]);

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

  const sharedScreen = useCallback(async () => {
    if (isSharedScreen) {
      await client.stopScreenShare();
      setIsSharedScreen(false);
    } else {
      await client.startScreenShare(mediaStream);
      setIsSharedScreen(true);
    }
  }, [client, mediaStream, isSharedScreen]);

  return;
};
