// import this in every page that requires authentication (any page that is not the root page - that page features a kinda landing page with a login button that redirects to the next auth sign in page with all login options)
// this is a temporary workaround until one day maybe we can just configure middleware to behave like I want it to

import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
