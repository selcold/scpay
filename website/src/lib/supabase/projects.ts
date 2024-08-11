"use server";

import { createProject, fetchProjects, updateProject } from "./main";

export interface TypeProject {
  id: number;
  title: string;
  description: string;
  info: {
    homepage?: string;
    tags: string[];
    version: string;
    language: {
      locale: string;
      url?: string;
    }[];
    images: {
      icon: string;
      banner?: string;
      screenshots?: string[];
    };
    status: {
      loves: number;
      views: number;
      cloud?: number;
    };
  };
  author: {
    id: number;
    username: string;
  };
  events?: {
    type: "event" | "custom" | "majorUpdate";
    title: string;
    description: string;
    image: string;
    timestamps: {
      from: Date | undefined;
      to?: Date | undefined;
    };
  }[];
  news?: {
    type: "note" | "tip" | "important" | "warning" | "caution";
    title: string;
    description: string;
    image: string;
    timestamps: {
      from: string;
      to?: string;
    };
  }[];
}

export async function GetProjects(): Promise<TypeProject[]> {
  try {
    const data: TypeProject[] = await fetchProjects();
    return data;
  } catch (error) {
    console.error("Error GET projects:", error);
    throw error;
  }
}

// IDを指定してプロジェクトを取得する関数
export async function GetProjectById(id: number): Promise<TypeProject | undefined> {
  try {
    const projects: TypeProject[] = await fetchProjects();
    const project = projects.find((proj) => `${proj.id}` === `${id}`);
    return project || undefined;
  } catch (error) {
    console.error(`Error GET project with ID ${id}:`, error);
    throw error;
  }
}

// 特定の作者が作成したプロジェクトを取得する関数
export async function GetProjectsByAuthor(
  username: string
): Promise<TypeProject[]> {
  try {
    const projects: TypeProject[] = await fetchProjects();
    const projectsByAuthor = projects.filter(
      (proj) => `${proj.author.username}` === `${username}`
    );
    return projectsByAuthor;
  } catch (error) {
    console.error(`Error GET projects by author ID ${username}:`, error);
    throw error;
  }
}

export async function PostProject(data: TypeProject) {
  try {
    await createProject(data);
  } catch (error) {
    console.error("Error POST project:", error);
    throw error;
  }
}

export async function PutProject(id: number, data: TypeProject) {
  try {
    const res = await updateProject(id, data);
    return res
  } catch  (error) {
    console.error("Error PUT project:", error);
    throw error;
  }
}
