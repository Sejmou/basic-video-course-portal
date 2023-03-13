import { NextPage } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Breadcrumbs from "~/components/Breadcrumbs";
import Button from "~/components/Button";
import { getServerSideProps as getServerSidePropsRedirect } from "~/utils/unauthorized-redirect";

const Dashboard: NextPage = () => {
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
        <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="flex w-full justify-between">
            <Breadcrumbs />
            <Button size="small" colored onClick={() => void signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

const getServerSideProps = getServerSidePropsRedirect;
export { getServerSideProps };

export default Dashboard;
