import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-[calc(100dvh-64px)]">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          404
        </p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 dark:bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
          >
            Go back home
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
