import Head from "next/head";
import { useRouter } from "next/router";
import { getLayout } from "~/components/UserAreaBaseLayout";
import { api } from "~/utils/api";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";
import { NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const courseData = api.courses.getCourseData.useQuery({ courseId: id });

  const title = courseData.data
    ? courseData.data.name
    : "Lade Kursübersicht...";

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
      {title}
    </>
  );
};

Dashboard.getLayout = getLayout;

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

export default Dashboard;
