import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { OnProgressProps } from "react-player/base";
import VimeoPlayer from "react-player/vimeo";
import ReactPlayer from "react-player/vimeo";
import IconButton from "../IconButton";
import { FullscreenEnter, FullscreenExit, Pause, Play, Replay } from "./icons";
import { createPlayerStore, PlayerContext, usePlayerStore } from "./store";
import { useProgressPercentage } from "./use-derived-state";
import { useKeyboardControls } from "./use-keyboard-controls";

const videoBaseUrl = "https://vimeo.com/";

type Props = { videoId: string; title: string };
const VideoPlayer = ({ videoId, title }: Props) => {
  const store = useMemo(() => createPlayerStore(), []); // store should not be recreated on every rerender of this component

  return (
    <PlayerContext.Provider value={store}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <PlayerWrapper videoId={videoId} />
      </div>
    </PlayerContext.Provider>
  );
};
export default VideoPlayer;

const PlayerWrapper = ({ videoId }: { videoId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setPlayerDomElement = usePlayerStore(
    (state) => state.setPlayerDomElement
  );
  const fullscreen = usePlayerStore((state) => state.fullscreen);
  const exitFullscreen = usePlayerStore((state) => state.exitFullscreen);
  useEffect(() => {
    if (containerRef.current) {
      setPlayerDomElement(containerRef.current);
    }
  }, [containerRef.current]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitFullscreen(); // need this workaround as user can exit fullscreen by pressing ESC (or maybe also in other ways) - we need to react to that as well and reset the player
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [exitFullscreen]);

  return (
    <div
      className={classNames(
        "justify-center focus:outline-none",
        { "relative max-w-screen-lg": !fullscreen },
        {
          "absolute top-0 left-0 h-screen w-screen": fullscreen,
        }
      )}
      ref={containerRef}
      tabIndex={-1} // required for keyboard controls hook to work
    >
      <ControlsContainer />
      <Player url={`${videoBaseUrl}${videoId}`} />
    </div>
  );
};

const ControlsContainer = () => {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  useKeyboardControls();

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
    }
  }, [fullscreen, ref.current?.getInternalPlayer()]);
  const setDuration = usePlayerStore((state) => state.setDuration);

  return (
    <ReactPlayer
      playing={playing}
      ref={ref}
      url={url}
      onProgress={timeUpdateHandler}
      onDuration={setDuration}
      onSeek={setCurrentTime}
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
        <TimeDisplay />
        <div className="flex-1"></div>
        <FullscreenButton />
      </div>
    </div>
  );
};

const TimeDisplay = () => {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);

  return (
    <div className="flex items-center text-sm">
      <span className="mr-1">{formatTime(currentTime)}</span>
      <span className="mr-1">/</span>
      <span className="mr-1">
        {duration !== undefined ? formatTime(duration) : "--:--"}
      </span>
    </div>
  );
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds - minutes * 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const PlayPauseButton = ({ className }: { className?: string }) => {
  const playing = usePlayerStore((state) => state.playing);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const reachedEnd = usePlayerStore((state) => state.reachedEndOfPlayback);

  return (
    <IconButton className={className} onClick={togglePlayPause}>
      {reachedEnd ? <Replay /> : playing ? <Pause /> : <Play />}
    </IconButton>
  );
};

const FullscreenButton = () => {
  const enterFullscreen = usePlayerStore((state) => state.enterFullscreen);
  const exitFullscreen = usePlayerStore((state) => state.exitFullscreen);
  const fullscreen = usePlayerStore((state) => state.fullscreen);

  const clickHandler = useCallback(() => {
    if (fullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [fullscreen, enterFullscreen, exitFullscreen]);

  return (
    <IconButton onClick={clickHandler}>
      {fullscreen ? <FullscreenExit /> : <FullscreenEnter />}
    </IconButton>
  );
};

const Timeline = () => {
  const progress = useProgressPercentage();
  const seekTo = usePlayerStore((state) => state.seekToFraction);
  const clickHandler = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const fraction = x / rect.width;
      seekTo(fraction);
      ev.stopPropagation();
    },
    [seekTo]
  );

  return (
    <div className="absolute bottom-9 left-0 z-10 flex h-2 w-full cursor-pointer items-center">
      <div
        className="relative mx-2 h-1 w-full bg-gray-500 hover:h-full"
        onClick={clickHandler}
      >
        <div
          className="absolute top-0 left-0 h-full bg-purple-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};
