"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import TagInput from "@/components/ui/TagInput";
import { PutProject, TypeProject } from "@/lib/supabase/projects";
import {
  GenerateImagePath,
  GetFileUrl,
  uploadFile,
} from "@/lib/supabase/storage";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";

interface EditProjectFormProps {
  setProjects: (value: React.SetStateAction<TypeProject[] | undefined>) => void;
  editProject: TypeProject | undefined;
  setEditProject: (
    value: React.SetStateAction<TypeProject | undefined>
  ) => void;
  formState: TypeProject;
  setFormState: (value: React.SetStateAction<TypeProject>) => void;
}

const EditProjectFormComp = React.memo(
  ({
    setProjects,
    editProject,
    setEditProject,
    formState,
    setFormState,
  }: EditProjectFormProps) => {
    useEffect(() => {
      if (editProject) {
        setFormState({
          id: editProject.id,
          title: editProject.title,
          description: editProject.description,
          info: {
            tags: editProject.info.tags,
            version: editProject.info.version,
            language: editProject.info.language,
            images: {
              icon: editProject.info.images.icon,
              screenshots: editProject.info.images.screenshots || [],
            },
            status: editProject.info.status,
          },
          author: editProject.author,
          events: editProject.events || [],
          news: editProject.news || [],
        });
      }
    }, [editProject, setFormState]);

    // Input
    const handleInputChange = useCallback(
      (state: TypeProject) => {
        setFormState(() => state);
      },
      [setFormState]
    );

    // Tags
    const handleTagsChange = useCallback(
      (newTags: string[]) => {
        setFormState((prevState) => ({
          ...prevState,
          info: {
            ...prevState.info,
            tags: newTags,
          },
        }));
      },
      [setFormState]
    );

    // Languages
    const handleAddLanguage = () => {
      setFormState((prevState) => ({
        ...prevState,
        info: {
          ...prevState.info,
          language: [...prevState.info.language, { locale: "", url: "" }],
        },
      }));
    };
    const handleRemoveLanguage = (index: number) => {
      setFormState((prevState) => {
        const newLanguages = [...prevState.info.language];
        newLanguages.splice(index, 1);
        return {
          ...prevState,
          info: { ...prevState.info, language: newLanguages },
        };
      });
    };

    // Images
    const [editImages, setEditImages] = useState({
      icon: null as null | string,
      screenshots: [] as string[],
    });

    useEffect(() => {
      const put = async () => {
        if (editProject) {
          setEditImages({
            icon: `${await GetFileUrl(editProject?.id, "icon")}` || null,
            screenshots: [
              `${await GetFileUrl(editProject?.id, "screenshot", 1)}`,
              `${await GetFileUrl(editProject?.id, "screenshot", 2)}`,
              `${await GetFileUrl(editProject?.id, "screenshot", 3)}`,
            ],
          });
        }
      };
      put();
    }, [editProject]);

    // Icon
    const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const path = GenerateImagePath(editProject?.id!, "icon");
        const url = await uploadFile(file, path);
        if (url) {
          setFormState((prevState) => ({
            ...prevState,
            info: {
              ...prevState.info,
              images: {
                ...prevState.info.images,
                icon: url,
              },
            },
          }));
        }
      }
    };

    // Screenshots
    const handleScreenshotChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const path = `projects/${editProject?.id}/screenshots/${index + 1}.png`;
        const url = await uploadFile(file, path);
        if (url) {
          const newScreenshots = [...(formState.info.images.screenshots || [])];
          newScreenshots[index] = url;
          setFormState((prevState) => ({
            ...prevState,
            info: {
              ...prevState.info,
              images: {
                ...prevState.info.images,
                screenshots: newScreenshots,
              },
            },
          }));
        }
      }
    };

    // Events
    const handleAddEvent = () => {
      setFormState((prevState) => ({
        ...prevState,
        events: [
          ...(prevState.events || []),
          {
            type: "event",
            title: "",
            description: "",
            image: "",
            timestamps: { from: undefined, to: undefined },
          },
        ],
      }));
    };
    const handleRemoveEvent = (index: number) => {
      setFormState((prevState) => {
        const newEvents = [...(prevState.events || [])];
        newEvents.splice(index, 1);
        return { ...prevState, events: newEvents };
      });
    };
    const handleEventDateChange = useCallback(
      (idx: number, newDate: DateRange | undefined) => {
        const newEvents = [...(formState.events || [])];
        newEvents[idx].timestamps = {
          from: newDate?.from,
          to: newDate?.to,
        };
        setFormState((prevState) => ({
          ...prevState,
          events: newEvents,
        }));
      },
      [setFormState, formState.events]
    );

    function ExitEditMode() {
      setEditProject(undefined);
    }

    const saveChanges = async () => {
      if (!editProject) return;

      const updatedProject = {
        ...editProject,
        title: formState.title,
        description: formState.description,
        info: {
          ...editProject.info,
          version: formState.info.version,
          tags: formState.info.tags,
          language: formState.info.language,
          images: {
            ...editProject.info.images,
            icon: formState.info.images.icon || "",
            screenshots: formState.info.images.screenshots,
          },
        },
        events: formState.events,
        news: formState.news,
      };
      try {
        // const RESPutProject = await PutProject(editProject.id, updatedProject);
        const RESPutProject = PutProject(editProject.id, updatedProject);
        toast.promise(RESPutProject, {
          loading: "保存中",
          success: "保存完了",
          error: "保存に失敗しました",
        });
        setProjects((prevProjects) =>
          prevProjects?.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
      } catch (error) {
        console.error("An error occurred", error);
      }
      ExitEditMode();
    };

    function FormContents({ name }: { name: string }) {
      if (name == "tags") {
        return (
          <div
            id="form-tags"
            className="flex flex-col justify-center items-start gap-2"
          >
            <label className="font-bold text-base">タグ</label>
            <TagInput
              onTagsChange={handleTagsChange}
              maxTags={5}
              initialTags={formState.info.tags}
            />
          </div>
        );
      }
      return null;
    }

    console.log(formState);

    if (!editProject) {
      return null;
    }
    return (
      <div className="fixed top-0 left-0 md:left-14 flex flex-col justify-between items-center w-full md:w-[calc(100%-56px)] h-[calc(100vh-65px)] md:h-dvh bg-neutral-200 dark:bg-neutral-700 overflow-hidden scrollbar p-2">
        <div className="flex flex-col justify-start items-center w-full h-auto overflow-y-auto overflow-x-hidden scrollbar">
          <section className="flex flex-col gap-4 container p-4 md:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row flex-wrap justify-between items-start w-full">
              <div className="flex flex-col justify-center items-start w-full md:w-1/2">
                <Image
                  className="w-[280px] sm:w-[380px] md:w-[480px] h-[160px] sm:h-[260px] md:h-[360px] rounded-t-lg"
                  alt="Image"
                  src={`https://cdn2.scratch.mit.edu/get_image/project/${editProject.id}_480x360.png`}
                  width={480}
                  height={360}
                />
              </div>
              <div className="flex flex-col justify-center gap-4 w-full md:w-1/2 p-2">
                <div className="flex flex-col justify-center items-start gap-2">
                  <label className="font-bold text-base">タイトル</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formState.title}
                    onChange={(e) =>
                      handleInputChange({
                        ...formState,
                        title: e.target.value,
                      })
                    }
                    className="c-bg c-border rounded-md w-full h-10 p-2 shadow-md"
                  />
                </div>
                <div className="flex flex-col justify-center items-start gap-2">
                  <label className="font-bold text-base">説明</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={(e) =>
                      handleInputChange({
                        ...formState,
                        description: e.target.value,
                      })
                    }
                    className="c-bg c-border rounded-md w-full h-40 md:h-56 max-h-56 p-2 shadow-md"
                  />
                </div>
              </div>
            </div>
            <FormContents name="tags" />
            <div
              id="form-version"
              className="flex flex-col justify-center items-start gap-2"
            >
              <label className="font-bold text-base">バージョン</label>
              <input
                id="version"
                name="version"
                type="text"
                value={formState.info.version}
                onChange={(e) =>
                  handleInputChange({
                    ...formState,
                    info: {
                      ...formState.info,
                      version: e.target.value,
                    },
                  })
                }
                className="c-bg border rounded-md w-full h-10 p-2 shadow-md"
              />
            </div>
            <div
              id="form-languages"
              className="flex flex-col justify-center items-start gap-2"
            >
              <h2 className="font-bold text-base">言語</h2>
              <section className="flex flex-col w-full c-bg c-border rounded-lg">
                {formState.info.language.map((lang, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row justify-center items-center gap-2 p-2 m-2 c-card c-border rounded-md shadow-md"
                  >
                    <div className="flex flex-col justify-start items-center gap-2 w-full md:w-1/2 md:p-2">
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>Lang</h2>
                        <input
                          id="locale"
                          name="locale"
                          type="text"
                          value={lang.locale}
                          onChange={(e) => {
                            const newLanguageLocale = [
                              ...formState.info.language,
                            ];
                            newLanguageLocale[idx].locale = e.target.value;
                            handleInputChange({
                              ...formState,
                              info: {
                                ...formState.info,
                                language: newLanguageLocale,
                              },
                            });
                          }}
                          className="c-bg c-border rounded-md h-10 p-2 shadow-md"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>ID</h2>
                        <input
                          id="url"
                          name="url"
                          type="number"
                          value={lang.url || ""}
                          onChange={(e) => {
                            const newLanguageUrl = [...formState.info.language];
                            newLanguageUrl[idx].url = e.target.value;
                            handleInputChange({
                              ...formState,
                              info: {
                                ...formState.info,
                                language: newLanguageUrl,
                              },
                            });
                          }}
                          className="c-bg c-border rounded-md h-10 p-2 shadow-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 w-full md:w-1/2 md:h-full">
                      <Button
                        variant="destructive"
                        className="w-fit h-full"
                        onClick={() => handleRemoveLanguage(idx)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
                  <Button
                    className={`w-full ${
                      formState.info.language.length > 0 && "rounded-t-none"
                    }`}
                    onClick={handleAddLanguage}
                    disabled={
                      formState.info.language.length > 249 ? true : false
                    }
                  >
                    {formState.info.language.length > 249
                      ? "設定上限です"
                      : "追加"}
                  </Button>
                </div>
              </section>
            </div>
            {/** Icon */}
            <div
              id="form-icon"
              className="flex flex-col justify-center items-start gap-2"
            >
              <h2 className="font-bold text-base">アイコン</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-2 p-2 c-bg c-border rounded-md shadow-md">
                <div className="shrink-0">
                  <Suspense
                    fallback={
                      <Skeleton className="w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 rounded-[20px]" />
                    }
                  >
                    {editImages.icon && (
                      <Image
                        src={`${editImages.icon}`}
                        alt="Icon"
                        width={100}
                        height={100}
                        className="h-16 w-16 md:h-24 md:w-24 object-cover rounded-md"
                      />
                    )}
                  </Suspense>
                </div>
                <label className="block">
                  <span className="sr-only">Choose icon image</span>
                  <input
                    type="file"
                    accept="image/*"
                    id="icon"
                    onChange={handleIconChange}
                    className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-neutral-200 hover:file:bg-blue-500/50 file:transition-all file:duration-300 file:ease-in-out"
                  />
                </label>
              </div>
            </div>
            {/** Screenshots */}
            <div
              id="form-screenshots"
              className="flex flex-col justify-center items-start gap-2"
            >
              <h2 className="font-bold text-base">スクリーンショット</h2>
              <section className="flex flex-col w-full c-bg c-border rounded-lg">
                {formState.info.images.screenshots?.map((screenshot, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row justify-center items-center gap-2 p-2 m-2 c-card c-border rounded-md shadow-md"
                  >
                    <div
                      key={index}
                      className="flex flex-row flex-wrap justify-start items-center gap-2 w-full"
                    >
                      <Suspense
                        fallback={
                          <Skeleton className="w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 rounded-[20px]" />
                        }
                      >
                        {/* {screenshot && (
                        )} */}
                        <Image
                          src={screenshot || "/generated/placeholder.svg"}
                          alt={`Screenshot ${index + 1}`}
                          width={280}
                          height={160}
                          className="h-16 md:h-24 w-24 md:w-36 object-cover rounded-md"
                          style={{
                            aspectRatio: "280/160",
                            objectFit: "cover",
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          id={`screenshot ${index + 1}`}
                          onChange={(e) => handleScreenshotChange(e, index)}
                          className="block w-full sm:w-fit text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-neutral-200 hover:file:bg-blue-500/50 file:transition-all file:duration-300 file:ease-in-out"
                        />
                      </Suspense>
                    </div>
                    <div className="flex justify-end items-center gap-2 w-full md:w-1/2 md:h-full">
                      <Button
                        variant="destructive"
                        className="w-fit h-full"
                        onClick={() => {
                          const newScreenshots = [
                            ...(formState.info.images.screenshots || []),
                          ];
                          newScreenshots.splice(index, 1);
                          setFormState((prevState) => ({
                            ...prevState,
                            info: {
                              ...prevState.info,
                              images: {
                                ...prevState.info.images,
                                screenshots: newScreenshots,
                              },
                            },
                          }));
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
                  <Button
                    type="button"
                    className={`w-full ${
                      formState.info.images.screenshots &&
                      formState.info.images.screenshots.length > 0 &&
                      "rounded-t-none"
                    }`}
                    onClick={() => {
                      setFormState((prevState) => ({
                        ...prevState,
                        info: {
                          ...prevState.info,
                          images: {
                            ...prevState.info.images,
                            ...prevState.info.images,
                            screenshots: [
                              ...(prevState.info.images.screenshots || []),
                              "",
                            ],
                          },
                        },
                      }));
                    }}
                    disabled={
                      formState.info.images.screenshots &&
                      formState.info.images.screenshots.length > 2
                        ? true
                        : false
                    }
                  >
                    {formState.info.images.screenshots &&
                    formState.info.images.screenshots.length > 2
                      ? "最大3個まで設定可能です"
                      : "追加"}
                  </Button>
                </div>
              </section>
            </div>
            {/** Events */}
            <div
              id="form-events"
              className="flex flex-col justify-center items-start gap-2"
            >
              <h2 className="font-bold text-base">イベント</h2>
              <section className="flex flex-col w-full c-bg c-border rounded-lg">
                {formState.events?.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center gap-2 p-2 m-2 c-card c-border rounded-md shadow-md"
                  >
                    <div className="flex flex-col justify-center items-center gap-2 w-full md:p-2">
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>画像<Link className="text-sm px-2 text-blue-500" href="docs/creator/events/imageUpload?requrl=close" target="_blank">ドキュメント</Link></h2>
                        <div className="flex c-bg c-border rounded-md max-w-xs w-full h-10 p-2 shadow-md">
                          <span>i.imgur.com/</span>
                          <input
                            id="eventImageUrl"
                            type="text"
                            placeholder="VyCQ5BY"
                            className="bg-transparent w-20 border-none outline-none"
                            value={event.image}
                            onChange={(e) => {
                              const newEvents = [...(formState.events || [])];
                              newEvents[idx].image = e.target.value;
                              setFormState((prevState) => ({
                                ...prevState,
                                events: newEvents,
                              }));
                            }}
                          />
                          <span>.png</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>タイプ</h2>
                        <Select
                          value={event.type}
                          onValueChange={(
                            value: "event" | "custom" | "majorUpdate"
                          ) => {
                            const newEvents = [...(formState.events || [])];
                            newEvents[idx].type = value;
                            setFormState((prevState) => ({
                              ...prevState,
                              events: newEvents,
                            }));
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                              <SelectItem value="majorUpdate">
                                Major Update
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>タイトル</h2>
                        <input
                          id="locale"
                          name="locale"
                          type="text"
                          value={event.title}
                          onChange={(e) => {
                            const newEvents = [...(formState.events || [])];
                            newEvents[idx].title = e.target.value;
                            setFormState((prevState) => ({
                              ...prevState,
                              events: newEvents,
                            }));
                          }}
                          className="c-bg c-border rounded-md h-10 p-2 shadow-md"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>説明</h2>
                        <input
                          id="url"
                          name="url"
                          type="text"
                          value={event.description}
                          onChange={(e) => {
                            const newEvents = [...(formState.events || [])];
                            newEvents[idx].description = e.target.value;
                            setFormState((prevState) => ({
                              ...prevState,
                              events: newEvents,
                            }));
                          }}
                          className="c-bg c-border rounded-md h-10 p-2 shadow-md"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap justify-between md:items-center gap-2 w-full">
                        <h2>日時</h2>
                        <DatePickerWithRange
                          initialDate={event.timestamps}
                          idx={idx}
                          onChangeDate={handleEventDateChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleRemoveEvent(idx)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
                  <Button
                    className={`w-full ${
                      formState.events &&
                      formState.events.length > 0 &&
                      "rounded-t-none"
                    }`}
                    onClick={handleAddEvent}
                    disabled={
                      formState.events && formState.events.length > 4
                        ? true
                        : false
                    }
                  >
                    {formState.events && formState.events.length > 4
                      ? "最大5個まで設定可能です"
                      : "追加"}
                  </Button>
                </div>
              </section>
            </div>
            {/** News */}
            <div
              id="form-news"
              className="flex flex-col justify-center items-start gap-2"
            >
              <h2 className="font-bold text-base">ニュース</h2>
              <div className="c-bg c-border rounded-md w-full h-10 shadow-md">
                {JSON.stringify(editProject?.news)}
              </div>
            </div>
          </section>
        </div>
        <div className="flex flex-row gap-2 w-full h-fit px-4 pt-2 c-border border-x-0 border-b-0">
          <Button variant="secondary" onClick={() => ExitEditMode()}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={() => ExitEditMode()}>
            削除
          </Button>
          <Button type="submit" onClick={saveChanges}>
            保存
          </Button>
        </div>
      </div>
    );
  }
);
EditProjectFormComp.displayName = "EditProjectFormComp";

export { EditProjectFormComp };
