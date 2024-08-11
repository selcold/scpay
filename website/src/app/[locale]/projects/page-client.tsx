"use client";

import { useTranslations } from "next-intl";

import React, { Suspense, useEffect, useState } from "react";
import { useAuthSession } from "scratch-auth-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TbCloud } from "react-icons/tb";
import { Cloud, Heart } from "lucide-react";
// import { projects } from "@/components/data/projects";

import { GetProjects, TypeProject } from "@/lib/supabase/projects";

//数字をK表記にするやつ
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default function PageClient() {
  const t = useTranslations("Pages.Projects");
  const session = useAuthSession();

  const [projects, setProjects] = useState<undefined | TypeProject[]>(
    undefined
  );

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await GetProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <>
      <p className="w-full h-fit text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold p-6 pb-16 bg-gradient-to-b from-fuchsia-400/70 to-white-0/0 text-white text-center">
        {t("Find your favorite game!")}
      </p>
      <div className="w-full h-fit pb-2.5">
        <div
          className="flex flex-wrap justify-center gap-1 w-full h-fit my-0 mx-auto mt-4"
          id="projects"
        >
          {projects?.map((project: TypeProject, idx: number) => (
            <div
              key={idx}
              className={`bg-neutral-200 dark:bg-neutral-600 w-[220px] m-2 rounded-2xl drop-shadow-md transition-all duration-300 ease-in-out`}
            >
              <Link
                className="flex justify-center mx-auto mt-2 mb-0"
                href={`./projects/${project.id}/`}
                target="_self"
              >
                <Suspense
                  fallback={
                    <Skeleton className="w-[204px] h-[152px] rounded-xl" />
                  }
                >
                  <Image
                    className="w-auto h-[152px] rounded-xl"
                    alt="Image"
                    src={`https://cdn2.scratch.mit.edu/get_image/project/${project.id}_480x360.png`}
                    width={204}
                    height={152}
                  />
                </Suspense>
              </Link>
              <div className="flex px-2 py-1">
                <div className="inline-block max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">
                  <Suspense
                    fallback={
                      <>
                        <Skeleton className="w-32 h-4" />
                        <div>
                          <Skeleton className="w-32 h-4" />
                        </div>
                      </>
                    }
                  >
                    <Link
                      href={`./projects/${project.id}/`}
                      target="_self"
                      className="font-bold text-xl"
                    >
                      {project.title}
                    </Link>
                    <div>
                      <Link
                        className="text-neutral-600 dark:text-neutral-400 text-sm"
                        href={`https://scratch.mit.edu/users/${project.author.username}/`}
                        target="_blank"
                      >
                        by {project.author.username}
                      </Link>
                    </div>
                    <div className="flex overflow-hidden">
                      {project.info.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="p-0.5 m-0.5 rounded-md text-sm bg-stone-700 text-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 p-1">
                      <span className="flex">
                        <Heart className="w-6 h-6" />
                        <span className="pl-[1px]">
                          {formatNumber(project.info.status.loves)}
                        </span>
                      </span>
                      {project.info.status.cloud && (
                        <span className="flex gap-1">
                          <TbCloud className="w-6 h-6" />
                          <span className="pl-[1px]">
                            {formatNumber(project.info.status.cloud)}
                          </span>
                        </span>
                      )}
                    </div>
                  </Suspense>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
