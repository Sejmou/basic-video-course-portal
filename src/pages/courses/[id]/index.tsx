import Head from "next/head";
import { useRouter } from "next/router";
import Card from "~/components/Card";
import { getLayout } from "~/components/UserAreaBaseLayout";
import { api } from "~/utils/api";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";
import { NextPageWithLayout } from "../../_app";

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const courses = api.courses.getCourseData.useQuery({ courseId: id });

  const title = courses.data ? courses.data.name : "Lade Kursübersicht...";

  const courseData = courses.data;

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
      {!courses.isLoading && courseData && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">{courseData.name}</h1>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courseData.chapters.map((chapter) => (
              <Card
                key={chapter.id}
                clickable
                onClick={() => void router.push(`/courses/${id}/${chapter.id}`)}
              >
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-lg font-semibold">{chapter.title}</h3>
                    {/* <p className="text-sm text-gray-500">
                          {course.description}
                        </p> */}
                  </div>
                  <div className="mt-4 flex flex-row items-center justify-between">
                    {/* <div className="flex flex-row items-center">
                          <img
                            src={course.author.avatar}
                            alt={course.author.name}
                            className="w-6 h-6 rounded-full"
                          />  
                          <p className="ml-2 text-sm text-gray-500">
                            {course.author.name}
                          </p>
                        </div> */}
                    <div className="flex flex-row items-center">
                      <p className="text-sm text-gray-500">
                        {chapter.videoCount} Videos
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

Dashboard.getLayout = getLayout;

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

export default Dashboard;
