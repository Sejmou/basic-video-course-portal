const videoApiBaseURL = "http://localhost:4444/videos/";

type Props = { videoId: string };
const VideoPlayer = ({ videoId }: Props) => {
  return <video src={`${videoApiBaseURL}${videoId}`} controls></video>;
};
export default VideoPlayer;
