# Video Course Portal
This is a website for a video course portal using videos hosted on Vimeo. I built a custom video player UI instead of the default Vimeo video player, with features that are particularly useful for dance videos (looping and slowing down parts of the video). I essentially rebuilt the website of the dancing school (which would have charged 5€ per month for a collection of videos that were publicly available (via Vimeo), but embedded in a player interface I didn't particularly like).

## Technologies used
This project builds on the [T3 Stack](https://github.com/t3-oss/create-t3-app). It includes

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org) for user authentication
- [Prisma](https://prisma.io) for DB-related stuff
- [Tailwind CSS](https://tailwindcss.com) for easier CSS
- [tRPC](https://trpc.io) for seamless integration between frontend and backend (no need to write REST API endpoints, fully typesafe)

## Development Notes

IMPORTANT: This somehow seems to crash when using CockroachDB and Node > 16. As a workaround just use Node v16 when running `dev`.
