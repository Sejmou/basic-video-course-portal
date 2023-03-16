import Head from "next/head";
import { useRouter } from "next/router";
import Card from "~/components/Card";
import { getLayout } from "~/components/UserAreaBaseLayout";
import { api } from "~/utils/api";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";
import { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  const courses = api.courses.getCourseList.useQuery();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Dashboard - Video Portal</title>
        <meta name="description" content="Dein Dashboard mit allen Kursen." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            <span className="align-middle text-2xl md:text-3xl">💃</span>
            Willkommen!{" "}
            <span className="align-middle text-2xl md:text-3xl">🕺</span>
          </h1>
          <p>
            Folgende Kurse sind verfügbar. Sicher ist für dich auch etwas dabei
            😉
          </p>
        </div>
        {courses.isLoading ? (
          <div>Lade Daten...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.data?.map((course) => (
              <Card
                key={course.id}
                clickable
                onClick={() => void router.push(`/courses/${course.id}`)}
              >
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-lg font-semibold">{course.name}</h3>
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
                        {course.chapterCount} Kapitel
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </>
    </>
  );
};

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

Dashboard.getLayout = getLayout;

export default Dashboard;
