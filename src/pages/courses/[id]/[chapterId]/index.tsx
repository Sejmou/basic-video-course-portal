import Head from "next/head";
import { useRouter } from "next/router";
import { getLayout } from "~/components/UserAreaBaseLayout";
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
        <meta
          name="description"
          content="A basic example for a video course portal, created with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!videos.isLoading && videoData && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">{videoData.title}</h1>
          <p className="text-lg">
            {videoData.videos.length} Video
            {(videoData.videos.length > 1 || videoData.videos.length == 0) &&
              "s"}
          </p>
          {videoData.videos.map((video) => (
            <div key={video.id}>
              <h3 className="text-lg font-semibold">{video.title}</h3>
            </div>
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
