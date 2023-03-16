import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef } from "react";
import VimeoPlayer from "react-player/vimeo";
import ReactPlayer from "react-player/vimeo";
import Button from "../Button";
import HelpTooltip from "../HelpTooltip";
import IconButton from "../IconButton";
import Toggle from "../Toggle";
import { FullscreenEnter, FullscreenExit, Pause, Play, Replay } from "./icons";
import {
  createPlayerStore,
  getInternalPlayer,
  PlayerContext,
  usePlayerStore,
} from "./store";
import { useAutohide } from "./use-autohide";
import {
  useLoopIntervalPercentage,
  useProgressPercentage,
} from "./use-derived-state";
import { useKeyboardControls } from "./use-keyboard-controls";

const videoBaseUrl = "https://vimeo.com/";

type Props = { videoId: string; title: string };
const VideoPlayer = ({ videoId, title }: Props) => {
  // TODO: move this logic into the store file if possible
  const store = useMemo(() => createPlayerStore(), []); // store should not be recreated on every rerender of this component

  // TODO: if you manage to move this logic into the store file, you could also move this (using api instead of store hook like here after "maybe I wouldn't even use useEffect": https://github.com/pmndrs/zustand/issues/140#issuecomment-673898644)
  useEffect(() => {
    const pollCurrentTime = () => {
      const player = store.getState().player;
      if (!player) return;
      const internalPlayer = getInternalPlayer(player);
      if (internalPlayer) {
        internalPlayer.getCurrentTime().then((time) => {
          store.getState().setCurrentTime(time); // cannot set currentTime directly, because we have to check if a loop is active and optionally skip back to the loop start
        });
      }
    };
    const timer = setInterval(pollCurrentTime, 50);

    return () => clearInterval(timer);
  }, [store]);

  return (
    <PlayerContext.Provider value={store}>
      <div className="w-full max-w-6xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <PlayerWrapper videoId={videoId} />
        <div className="mt-1 flex w-full">
          <LoopControls className="w-full" />
          <PlaybackRateControls />
        </div>
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
      className={classNames("relative w-full pt-[56.25%] focus:outline-none", {
        "absolute top-0 left-0 h-screen w-screen": fullscreen,
      })}
      ref={containerRef}
      tabIndex={-1} // required for keyboard controls hook to work
    >
      <ControlsContainer />
      <Player
        url={`${videoBaseUrl}${videoId}`}
        className="react-player absolute top-0 left-0 h-full w-full"
      />
    </div>
  );
};

const ControlsContainer = () => {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const playing = usePlayerStore((state) => state.playing);
  useKeyboardControls();
  const ref = useRef<HTMLDivElement>(null);
  useAutohide(ref.current, playing);

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-10 select-none before:content-none focus-within:opacity-100 hover:opacity-100"
      onClick={togglePlayPause}
      ref={ref}
    >
      <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <Timeline />
      <Controls />
    </div>
  );
};

const Player = ({ url, className }: { url: string; className?: string }) => {
  const ref = useRef<VimeoPlayer>(null);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    if (ref.current) {
      setPlayer(ref.current);
    }
  }, [ref, setPlayer]);
  const playing = usePlayerStore((state) => state.playing);
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
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
      onDuration={setDuration}
      onSeek={setCurrentTime}
      width="100%"
      height="100%"
      className={className}
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
  const [loopStart, loopEnd] = useLoopIntervalPercentage();
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
        ></div>
        {/* loop markers */}
        {loopStart && (
          <div
            className="loop-start absolute top-0 left-0 h-full w-[3px] -translate-x-[1.5px] bg-yellow-500"
            style={{
              left: `${loopStart}%`,
            }}
          />
        )}
        {loopEnd && (
          <div
            className="loop-start absolute top-0 left-0 h-full w-[3px] -translate-x-[1.5px] bg-yellow-500"
            style={{
              left: `${loopEnd}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};

const LoopControls = ({ className }: { className?: string }) => {
  const initialized = usePlayerStore((state) => !!state.duration);
  const looping = usePlayerStore((state) => state.looping);
  const toggleLoop = usePlayerStore((state) => state.toggleLoop);
  const [start, end] = usePlayerStore((state) => state.loopInterval) ?? [];

  const setStart = usePlayerStore((state) => state.setLoopStart);
  const setEnd = usePlayerStore((state) => state.setLoopEnd);
  const reset = usePlayerStore((state) => state.resetLoop);

  return (
    <div className={classNames("flex items-center", className)}>
      {initialized && (
        <div className="flex gap-2">
          <Toggle enabled={looping} onChange={toggleLoop} text="Loop" />
          {looping && (
            <div className="flex items-center justify-center gap-1">
              <Button size="extra-small" onClick={() => setStart()}>
                Start
              </Button>
              <Button size="extra-small" onClick={() => setEnd()}>
                Ende
              </Button>
              <span className="text-xs">
                {start === undefined || end === undefined
                  ? "(Start- und Endpunkt setzen um Loop zu starten)"
                  : `${formatTime(start)} - ${formatTime(end)}`}
              </span>
              <HelpTooltip
                text={
                  "Setze den Start- und Endpunkt durch Klick auf die Buttons während der Videowiedergabe."
                }
              />
              <Button size="extra-small" onClick={reset}>
                Zurücksetzen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlaybackRateControls = () => {
  const playbackRate = usePlayerStore((state) => state.playbackRate);
  const increasePlaybackRate = usePlayerStore(
    (state) => state.increasePlaybackRate
  );
  const decreasePlaybackRate = usePlayerStore(
    (state) => state.decreasePlaybackRate
  );

  return (
    <div className="flex items-center gap-2">
      <span>Tempo</span>
      <Button size="extra-small" onClick={() => decreasePlaybackRate(0.1)}>
        -
      </Button>
      <span className="text-xs">{roundToNPlaces(playbackRate, 2)}x</span>
      <Button size="extra-small" onClick={() => increasePlaybackRate(0.1)}>
        +
      </Button>
    </div>
  );
};

function roundToNPlaces(num: number, places: number) {
  return Math.round(num * 10 ** places) / 10 ** places;
}
