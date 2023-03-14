import classNames from "classnames";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { OnProgressProps } from "react-player/base";
import VimeoPlayer from "react-player/vimeo";
import ReactPlayer from "react-player/vimeo";
import IconButton from "../IconButton";
import { FullscreenEnter, FullscreenExit, Pause, Play } from "./icons";
import { createPlayerStore, PlayerContext, usePlayerStore } from "./store";

const videoBaseUrl = "https://vimeo.com/";

type Props = { videoId: string };
const VideoPlayer = ({ videoId }: Props) => {
  const store = useMemo(() => createPlayerStore(), []); // store should not be recreated on every rerender of this component

  return (
    <PlayerContext.Provider value={store}>
      <PlayerWrapper videoId={videoId} />
    </PlayerContext.Provider>
  );
};
export default VideoPlayer;

const PlayerWrapper = ({ videoId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setPlayerDomElement = usePlayerStore(
    (state) => state.setPlayerDomElement
  );
  const fullscreen = usePlayerStore((state) => state.fullscreen);
  useEffect(() => {
    if (containerRef.current) {
      setPlayerDomElement(containerRef.current);
    }
  }, [containerRef.current]);
  console.log({ fullscreen });
  return (
    <div
      className={classNames(
        "justify-center",
        { "relative max-w-screen-lg": !fullscreen },
        {
          "absolute top-0 left-0 h-screen w-screen": fullscreen,
        }
      )}
      ref={containerRef}
    >
      <ControlsContainer />
      <Player url={`${videoBaseUrl}${videoId}`} />
    </div>
  );
};

const ControlsContainer = () => {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 select-none opacity-0 before:content-none focus-within:opacity-100 hover:opacity-100"
      onClick={togglePlayPause}
    >
      <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <Timeline />
      <Controls />
    </div>
  );
};

const Player = ({ url }: { url: string }) => {
  const ref = useRef<VimeoPlayer>(null);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    if (ref.current) {
      setPlayer(ref.current);
    }
  }, [ref, setPlayer]);
  const playing = usePlayerStore((state) => state.playing);
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const timeUpdateHandler = useCallback(
    (ev: OnProgressProps) => {
      setCurrentTime(ev.playedSeconds);
    },
    [setCurrentTime]
  );
  const fullscreen = usePlayerStore((state) => state.fullscreen);
  useEffect(() => {
    if (ref.current) {
      const wrapper = (ref.current as any).wrapper as HTMLElement;
      if (fullscreen) {
        wrapper.classList.add("important-fullsize"); // this is a pretty ugly hack using a global style (class which sets width: 100% and height 100% with !important) - couldn't figure out how to make iframe wrapper div fullscreen otherwise
      } else {
        wrapper.classList.remove("important-fullsize");
      }
      console.log(wrapper);
    }
  }, [fullscreen, ref.current?.getInternalPlayer()]);

  return (
    <ReactPlayer
      playing={playing}
      ref={ref}
      url={url}
      onProgress={timeUpdateHandler}
    ></ReactPlayer>
  );
};

const Controls = () => {
  // TODO
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute bottom-0 left-0 flex w-full fill-current p-2 text-white"
        onClick={(ev) => ev.stopPropagation()}
      >
        <PlayPauseButton />
        <div className="flex-1"></div>
        <FullscreenButton />
      </div>
    </div>
  );
};

const PlayPauseButton = ({ className }: { className?: string }) => {
  const playing = usePlayerStore((state) => state.playing);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  return (
    <IconButton className={className} onClick={togglePlayPause}>
      {playing ? <Pause /> : <Play />}
    </IconButton>
  );
};

const FullscreenButton = () => {
  const toggleFullscreen = usePlayerStore((state) => state.toggleFullscreen);
  const fullscreen = usePlayerStore((state) => state.fullscreen);

  return (
    <IconButton onClick={toggleFullscreen}>
      {fullscreen ? <FullscreenExit /> : <FullscreenEnter />}
    </IconButton>
  );
};

const Timeline = () => {
  return <div></div>; // TODO
};
