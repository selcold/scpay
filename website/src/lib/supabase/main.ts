import supabase from "./client";
import { TypeProject } from "./projects";

export const createProject = async (projectData: TypeProject) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// プロジェクトデータを取得する関数
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// プロジェクトデータを更新する関数
export const updateProject = async (id: number, updatedData: TypeProject) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
