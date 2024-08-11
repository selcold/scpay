"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useAuthSession,
  ScratchAuth_Login,
  ScratchAuth_Logout,
  useUserInfo,
} from "scratch-auth-react";
import { Heart, UserRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flag, MapPin, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TagInput from "@/components/ui/TagInput";
import {
  GetProjectsByAuthor,
  PutProject,
  TypeProject,
} from "@/lib/supabase/projects";
import {
  GenerateImagePath,
  GetFileUrl,
  uploadFile,
} from "@/lib/supabase/storage";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import config from "../../../../richtpl.config";
import LanguageSelest from "@/components/ui/LanguageSelest";
import { ModeToggle, SelectTheme } from "@/components/ui/ModeToggle";
import { EditProjectFormComp } from "./editForm";

export default function PageClient() {
  const locale = useLocale();
  const t = useTranslations();
  const s = useTranslations("Pages.Profile");
  const a = useTranslations("Auth");

  const session = useAuthSession();
  const user_json = useUserInfo(session);

  const [projects, setProjects] = useState<undefined | TypeProject[]>(
    undefined
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await GetProjectsByAuthor("Masaabu-YT");
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  const [editProject, setEditProject] = useState<TypeProject | undefined>(
    undefined
  );
  const [formState, setFormState] = useState<TypeProject>({
    id: 0,
    title: "",
    description: "",
    info: {
      homepage: "",
      tags: [],
      version: "",
      language: [],
      images: {
        icon: "",
        banner: "",
        screenshots: [],
      },
      status: {
        loves: 0,
        views: 0,
        cloud: 0,
      },
    },
    author: {
      id: 0,
      username: "",
    },
  });

  return (
    <div
      className={`relative flex w-full h-[calc(100vh-65px)] md:h-dvh overflow-y-auto ${
        editProject && "overflow-hidden"
      } scrollbar-none`}
    >
      <div className="flex flex-col justify-center items-center gap-5 w-full h-fit px-2 md:px-10 py-10">
        <div className="flex flex-col gap-2 w-full max-w-3xl h-full">
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-600 rounded-lg shadow-md">
            <div className="w-full h-32 bg-neutral-300 dark:bg-neutral-500 rounded-t-lg" />
            <section className="w-full h-full px-2 md:px-10 *:w-full *:h-fit *:border-neutral-400 *:border-b *:mb-4">
              <div className="last:border-none">
                <div className="flex flex-row justify-start items-center">
                  <div>
                    <div className="relative flex items-center w-24 h-24">
                      <Avatar className="absolute top-[-30px] w-24 h-24">
                        <AvatarImage src={user_json?.profile.images["90x90"]} />
                        <AvatarFallback>Me</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full my-2 pl-4">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold">
                        {session || <Skeleton className="h-7 w-[150px]" />}
                      </h1>
                    </div>
                    <div>
                      <div className="relative flex flex-wrap gap-2 w-auto">
                        <div className="flex items-center gap-1">
                          {user_json?.history.joined ? (
                            <>
                              <Flag className="w-4 h-4" />
                              <span className="text-sm text-neutral-400 dark:text-neutral-300">
                                {new Date(
                                  user_json?.history.joined
                                ).toLocaleDateString(
                                  `${config.i18n.locales.find(
                                    (lang) => lang === locale
                                  )}`
                                )}
                              </span>
                            </>
                          ) : (
                            <Skeleton className="h-4 w-[100px]" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {user_json?.profile.country ? (
                            <>
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm text-neutral-400 dark:text-neutral-300">
                                {user_json?.profile.country}
                              </span>
                            </>
                          ) : (
                            <Skeleton className="h-4 w-[50px]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="last:border-none">
                <div className="flex flex-row justify-start items-center gap-2 pb-4">
                  <div>
                    {session ? (
                      <Button
                        variant="outline"
                        onClick={() => ScratchAuth_Logout()}
                      >
                        {a("logout")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => ScratchAuth_Login()}
                      >
                        {a("login")}
                      </Button>
                    )}
                  </div>
                  <LanguageSelest />
                </div>
              </div>
            </section>
            <section className="flex flex-col justify-center items-center gap-2 w-full">
              <div className="flex flex-col gap-2 w-full px-6 py-8">
                <h1 className="font-bold text-2xl">{s("Appearance")}</h1>
                <SelectTheme />
              </div>
            </section>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-3xl h-full">
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-600 rounded-lg p-3 shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold p-2">
              あなたのプロジェクト
            </h1>
            <section className="flex flex-wrap justify-center md:justify-start items-center gap-2 p-5">
              {projects?.map((project: TypeProject, idx: number) => (
                <Suspense key={idx} fallback={<></>}>
                  <div
                    onClick={() => {
                      setEditProject(project), setFormState(project);
                    }}
                  >
                    <div className="bg-neutral-100 border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600 border rounded-lg drop-shadow-xl">
                      <Image
                        className="rounded-t-lg"
                        alt="Image"
                        src={`https://cdn2.scratch.mit.edu/get_image/project/${project.id}_480x360.png`}
                        width={204}
                        height={152}
                      />
                      <div className="p-2">
                        <p className="text-xl">{project.title}</p>
                        <p className="text-sm text-green-400">{"公開中"}</p>

                        <div className="flex flex-wrap gap-2">
                          <span className="flex">
                            <Heart className="w-6 h-6" />
                            <span className="pl-[1px]">
                              {project.info.status.loves}
                            </span>
                          </span>
                          <span className="flex">
                            <UserRound className="w-6 h-6" />
                            <span className="pl-[1px]">
                              {project.info.status.views}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Suspense>
              ))}
            </section>
          </div>
        </div>
      </div>
      {formState && (
        <EditProjectFormComp
          setProjects={setProjects}
          editProject={editProject}
          setEditProject={setEditProject}
          formState={formState}
          setFormState={setFormState}
        />
      )}
    </div>
  );
}

{
  /* <section className="flex flex-col gap-2 my-2 px-1 w-full">
<div className="flex w-full h-fit justify-center items-center">
  <div className="w-[250px] relative">
    <input
      className="peer w-full p-2 pt-6 bg-inherit border-b-2 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-gray-500 focus:border-blue-500"
      type="text"
      name="username"
      id="username"
      placeholder=""
      defaultValue={formState.title}
    />
    <label
      htmlFor="username"
      className="absolute text-gray-500 text-base duration-150 transform -translate-y-5 top-5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500"
    >
      タイトル
    </label>
  </div>
</div>
</section> */
}
