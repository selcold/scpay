import supabase from "./client";

// 画像パスを生成する関数
export function GenerateImagePath(
  projectId: number,
  type: "icon" | "screenshot",
  number?: number
): string {
  if (type === "icon") {
    return `projects/${projectId}/icon.png`;
  } else if (type === "screenshot") {
    if (number === undefined) {
      throw new Error("Screenshot type requires a number parameter.");
    }
    return `projects/${projectId}/screenshots/${number}.png`;
  } else {
    throw new Error("Invalid type specified. Must be 'icon' or 'screenshot'.");
  }
}

// ファイルをバケットから取得し、URLを返す関数
export async function GetFileUrl(
  projectId: number,
  type: "icon" | "screenshot",
  number?: number
): Promise<string | null> {
  try {
    const path = GenerateImagePath(projectId, type, number);
    const { data } = await supabase.storage
      .from("project-images")
      .getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL:", error);
    throw error;
  }
}

// ファイルをバケットにアップロードし、URLを返す関数
export async function uploadFile(
  file: File,
  path: string
): Promise<string | null> {
  // 既存のファイルを置き換える
  const { data: existingFile, error: existingFileError } = await supabase.storage
    .from("project-images")
    .remove([path]);
  if (existingFileError && existingFileError.message !== 'The resource was not found') {
    console.error("Error removing existing file:", existingFileError);
    return null;
  }

  const { data, error } = await supabase.storage
    .from("project-images")
    .upload(path, file);
  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  const { data: publicData } = await supabase.storage
    .from("project-images")
    .getPublicUrl(path);
  if (!publicData) {
    console.error("Error getting public URL.");
    return null;
  }

  return publicData.publicUrl;
}
