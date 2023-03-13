import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react";
import Button from "~/components/Button";
import { getServerAuthSession } from "~/server/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - Video Portal</title>
        <meta
          name="description"
          content="A basic example for a video course portal, created with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Learn <span className="text-[hsl(280,100%,70%)]">Dancing</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
          <Button onClick={() => void signIn()}>Sign In</Button>
        </div>
      </div>
    </main>
  );
};
