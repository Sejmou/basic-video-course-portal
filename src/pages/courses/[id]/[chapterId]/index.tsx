import Head from "next/head";
import { useRouter } from "next/router";
import { getLayout } from "~/components/UserAreaBaseLayout";
import VideoPlayer from "~/components/VideoPlayer";
import { api } from "~/utils/api";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";
import { NextPageWithLayout } from "../../../_app";

const Videos: NextPageWithLayout = () => {
  const router = useRouter();
  const chapterId = router.query.chapterId as string;
  const videos = api.courses.getChapterData.useQuery({ chapterId });

  const title = videos.data ? videos.data.title : "Lade Videoübersicht...";

  const videoData = videos.data;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Videoübersicht für den Kurs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!videos.isLoading && videoData && (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold md:text-4xl">{videoData.title}</h1>
          <p className="text-lg">
            {videoData.videos.length} Video
            {(videoData.videos.length > 1 || videoData.videos.length == 0) &&
              "s"}
          </p>
          {videoData.videos.map((video) => (
            <VideoPlayer
              key={video.id}
              videoId={video.id}
              title={video.title}
            />
          ))}
        </div>
      )}
    </>
  );
};

Videos.getLayout = getLayout;

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

export default Videos;
