import ReactPlayer from "react-player/vimeo";

const videoBaseUrl = "https://vimeo.com/";

type Props = { videoId: string };
const VideoPlayer = ({ videoId }: Props) => {
  return <ReactPlayer controls url={`${videoBaseUrl}${videoId}`}></ReactPlayer>;
};
export default VideoPlayer;
