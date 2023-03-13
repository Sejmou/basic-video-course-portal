import Link from "next/link";
import { NextRouter, useRouter } from "next/router";

const Breadcrumbs = () => {
  const router = useRouter();
  const crumbs = generateBreadcrumbs(router);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Kurs-Übersicht
          </Link>
        </li>
        {crumbs.map(({ href, text }, index) => (
          <li key={index}>
            {index === crumbs.length - 1 ? (
              <Link href={href} className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                  {text}
                </span>
              </Link>
            ) : (
              <Link href={href} className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <a
                  href="#"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ml-2"
                >
                  {text}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

// copied/adapted from https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa
function generateBreadcrumbs(router: NextRouter) {
  // Remove any query parameters, as those aren't included in breadcrumbs
  const asPathWithoutQuery = router.asPath.split("?")[0]!;

  // Break down the path between "/"s, removing empty entities
  // Ex:"/my/nested/path" --> ["my", "nested", "path"]
  const asPathNestedRoutes = asPathWithoutQuery
    .split("/")
    .filter((v) => v.length > 0);

  // Iterate over the list of nested route parts and build
  // a "crumb" object for each one.
  const crumbs = asPathNestedRoutes.map((subpath, idx) => {
    // We can get the partial nested route for the crumb
    // by joining together the path parts up to this point.
    const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
    // The title will just be the route string for now
    const title = subpath;
    return { href, text: toTitleCase(title) };
  });

  return crumbs.slice(1, crumbs.length); // remove the first crumb, which is the Dashboard Home page in our case
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
