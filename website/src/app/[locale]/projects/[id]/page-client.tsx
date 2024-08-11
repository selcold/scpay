"use client";

import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import {
  APIGetProjectInfo,
  ScratchAPIGetProjectInfo,
} from "@/components/scratch/get";
import { Heart, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetProjectById, TypeProject } from "@/lib/supabase/projects";
import { GetFileUrl } from "@/lib/supabase/storage";
import Loading from "../../loading";
import NotFound from "@/components/pages/not-found";

function PageClient({ id }: { id: number }) {
  const t = useTranslations();
  const p = useTranslations("Pages.Project/[id]");
  const [ProjectInfo, setProjectInfo] = useState<APIGetProjectInfo>();

  const [project, setProject] = useState<undefined | null | TypeProject>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await GetProjectById(id);
      setProject(data);
    };
    fetchProjects();
  }, [id]);

  useEffect(() => {
    const Api = async () => {
      const res = await ScratchAPIGetProjectInfo(id);
      setProjectInfo(res);
    };
    Api();
  }, [id]);

  const [projectImages, setProjectImages] = useState({
    icon: null as null | string,
    screenshots: [] as string[],
  });
  useEffect(() => {
    const put = async () => {
      setProjectImages({
        icon: `${await GetFileUrl(id, "icon")}` || null,
        screenshots: [
          `${await GetFileUrl(id, "screenshot", 1)}`,
          `${await GetFileUrl(id, "screenshot", 2)}`,
          `${await GetFileUrl(id, "screenshot", 3)}`,
        ],
      });
    };
    put();
  }, [id]);

  if (project === null) {
    return <Loading />;
  }

  if (project === undefined) {
    return <NotFound title="Project not found" />;
  }

  function ProjectSubTitleContent() {
    return (
      <>
        {ProjectInfo ? (
          <>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                {project?.title || <Skeleton className="w-60 h-8" />}
              </h1>
            </div>
            <div className="flex flex-col justify-center md:justify-start gap-2 p-1">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <div className="flex flex-wrap gap-2 md:pr-5">
                  <span className="flex">
                    <span className="">
                      {new Date(`${ProjectInfo.history.shared}`).getFullYear()}
                    </span>
                    <span>・</span>
                    <span className="">{ProjectInfo.author.username}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex">
                    <Heart className="w-6 h-6" />
                    <span className="pl-[1px]">{ProjectInfo.stats.loves}</span>
                  </span>
                  <span className="flex">
                    <UserRound className="w-6 h-6" />
                    <span className="pl-[1px]">{ProjectInfo.stats.views}</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-2">
                <Link
                  href={`https://scratch.mit.edu/projects/${id}/`}
                  target="block"
                >
                  <button
                    aria-label={`${t("Play")}`}
                    className="text-white bg-green-500 shadow-green-400/50 hover:shadow-green-500/50 active:shadow-green-500/20 active:opacity-50 text-base font-bold px-3 py-2 rounded-md shadow-lg drop-shadow-lg transition-all duration-300 ease-in-out"
                  >
                    {t("Play")}
                  </button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <Skeleton className="w-60 h-8" />
            </div>
            <div className="flex flex-col justify-center md:justify-start gap-2 p-1">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <div className="flex flex-wrap gap-2 md:pr-5">
                  <Skeleton className="w-24 h-6" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="w-12 h-6" />
                  <Skeleton className="w-12 h-6" />
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-2">
                <Skeleton className="w-32 h-6" />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="lex flex-col justify-start items-center w-full h-full overflow-y-scroll scrollbar">
        <div
          className="relative flex w-full h-[450px] md:h-[500px] bg-neutral-300 bg-cover bg-top bg-no-repeat 
              after:absolute after:bottom-0 after:bg-gradient-to-t after:from-neutral-200 after:dark:from-neutral-700 after:to-neutral-700/0 after:w-full after:h-[80%] after:md:h-[50%]"
          style={{
            backgroundImage: `url(https://cdn2.scratch.mit.edu/get_image/project/${id}_480x360.png)`,
          }}
        />
        <div className="relative flex flex-col justify-start items-center w-full h-fit">
          <div className="flex w-full max-w-2xl h-fit">
            <div className="relative -top-10 md:-top-15 flex flex-col md:flex-row justify-center items-center md:items-start w-full max-w-2xl h-fit px-2 mb-5">
              <div className="w-20 md:w-28 lg:w-32 h-20 md:h-28 lg:h-32">
                <div className="absolute -top-10 md:-top-5">
                  <Suspense
                    fallback={
                      <div className="bg-neutral-100 dark:bg-neutral-600 border-neutral-200 dark:border-neutral-700 border-4 md:border-8 rounded-[20px] w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32">
                        <Skeleton className="w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 rounded-[20px]" />
                      </div>
                    }
                  >
                    <div
                      className="bg-neutral-100 dark:bg-neutral-600 border-neutral-200 dark:border-neutral-700 border-4 md:border-8 rounded-[20px] w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${projectImages.icon})`,
                      }}
                    />
                  </Suspense>
                </div>
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <ProjectSubTitleContent />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center gap-5 w-full h-fit px-2 md:px-10 py-10">
            <div className="flex flex-col justify-start gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-white drop-shadow-lg w-full max-w-4xl h-fit px-5 py-3 rounded-lg">
              <h1 className="text-2xl font-bold">{p("Screenshots")}</h1>
              <section className="flex flex-row justify-start items-center gap-2 w-full h-fit overflow-x-scroll snap-x scrollbar">
                {project.info?.images.screenshots ? (
                  <>
                    {project.info?.images.screenshots?.map((img, idx) => (
                      <Dialog key={idx}>
                        <Suspense
                          fallback={
                            <Skeleton className="w-[240px] h-[180px] rounded-lg" />
                          }
                        >
                          <DialogTrigger asChild>
                            <Image
                              key={idx}
                              src={`${projectImages.screenshots[idx]}`}
                              alt="Image"
                              width={240}
                              height={180}
                              className="w-[240px] h-[180px] rounded-lg snap-center cursor-pointer"
                              priority
                            />
                          </DialogTrigger>
                        </Suspense>
                        <DialogContent className="w-full h-fit bg-transparent border-none p-10">
                          <DialogHeader className="hidden">
                            <DialogTitle>{idx}</DialogTitle>
                            <DialogDescription>image {idx}</DialogDescription>
                          </DialogHeader>
                          <Suspense
                            fallback={
                              <Skeleton className="w-[480px] h-[360px] rounded-lg" />
                            }
                          >
                            <Image
                              key={idx}
                              src={`${projectImages.screenshots[idx]}`}
                              alt="Image"
                              width={480}
                              height={360}
                              className="rounded-lg"
                              priority
                            />
                          </Suspense>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </>
                ) : (
                  <div className="flex justify-center items-center bg-neutral-700/50 w-[240px] h-[180px] rounded-lg snap-center">
                    <h1 className="text-base font-bold text-neutral-500 dark:text-neutral-300 text-center">
                      {t(`Image does not exist`)}
                    </h1>
                  </div>
                )}
              </section>
            </div>
            <div className="flex flex-col justify-start gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-white drop-shadow-lg w-full max-w-4xl h-fit px-5 py-3 rounded-lg">
              <h1 className="text-2xl font-bold">{p("Description")}</h1>
              <p className="text-base text-neutral-500 dark:text-neutral-300">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.info.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-1 py-1 rounded-md text-sm bg-stone-700 text-neutral-200"
                    aria-label={`Tag:${tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-start gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-white drop-shadow-lg w-full max-w-4xl h-fit px-5 py-3 rounded-lg">
              <h1 className="text-2xl font-bold">{p("Information")}</h1>
              <div className="flex flex-wrap justify-start gap-10 w-full h-fit py-2 text-xl font-bold">
                <div className="flex flex-col justify-start items-start gap-1 w-full max-w-52 h-fit">
                  <h2 className="text-base text-neutral-500 dark:text-neutral-300">
                    {p("Author")}
                  </h2>
                  <Link
                    href={`../users/${project.author.username}/`}
                    className="flex items-center"
                  >
                    <Avatar className="rounded-2xl w-10 h-10 mr-2">
                      <AvatarImage
                        src={`https://uploads.scratch.mit.edu/get_image/user/${project.author.id}_60x60.png`}
                      />
                      <AvatarFallback>CR</AvatarFallback>
                    </Avatar>
                    {project.author.username}
                  </Link>
                </div>
                <div className="flex flex-col justify-start items-start gap-1 w-full max-w-52 h-fit">
                  <h2 className="text-base text-neutral-500 dark:text-neutral-300">
                    {p("Version")}
                  </h2>
                  <p className="">{project.info.version}</p>
                </div>
                <div className="flex flex-col justify-start items-start gap-1 w-full max-w-52 h-fit">
                  <h2 className="text-base text-neutral-500 dark:text-neutral-300">
                    {p("Languages")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.info.language.map((locale, idx) => (
                      <span key={idx}>
                        {locale.url && locale.url !== `${id}` ? (
                          <Link
                            href={`./${locale.url}`}
                            className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-500 hover:underline transition-all duration-300 ease-in-out"
                          >
                            <span>{locale.locale}</span>
                          </Link>
                        ) : (
                          <span>{locale.locale}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-800 dark:text-white drop-shadow-lg w-full max-w-4xl h-fit px-5 py-3 rounded-lg">
              <h1 className="text-2xl font-bold">イベント</h1>
              <section className="flex flex-wrap gap-2">
                {project.events?.map((event, idx) => (
                  <div
                    key={idx}
                    className={`relative w-[240px] h-[180px] p-2 c-bg drop-shadow-md rounded-lg bg-cover bg-top bg-no-repeat`}
                    style={{
                      backgroundImage: `url(${event.image ? `https://i.imgur.com/${event.image}.png` : `https://cdn2.scratch.mit.edu/get_image/project/${id}_480x360.png`})`,
                    }}
                  >
                    <div className="after:rounded-b-lg after:absolute after:left-0 after:bottom-0 after:bg-gradient-to-t after:from-neutral-200 after:dark:from-neutral-700 after:to-neutral-700/0 after:w-full after:h-[80%] after:md:h-[70%]" />
                    <div className="absolute left-0 bottom-0 w-full p-2">
                      <h2 className="font-bold truncate">{event.title}</h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-200 truncate">{event.description}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageClient;
