import { GetStaticProps, NextPage } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Breadcrumbs from "~/components/Breadcrumbs";
import Button from "~/components/Button";
import Card from "~/components/Card";
import { api } from "~/utils/api";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";

const Dashboard: NextPage = () => {
  const courses = api.courses.getCourseList.useQuery();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Dashboard - Video Portal</title>
        <meta
          name="description"
          content="A basic example for a video course portal, created with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] py-8 px-4">
        <Card>
          <div className="mb-2 flex w-full justify-between">
            <Breadcrumbs />
            <Button size="small" colored onClick={() => void signOut()}>
              Logout
            </Button>
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
        </Card>
      </main>
    </>
  );
};

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

export default Dashboard;
