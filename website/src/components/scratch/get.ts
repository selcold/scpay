"use server";

export interface APIGetProjectInfo {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: string;
  public: boolean;
  comments_allowed: boolean;
  is_published: boolean;
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    history: {
      joined: string;
    };
    profile: {
      id: null;
      images: {
        "90x90": string;
        "60x60": string;
        "55x55": string;
        "50x50": string;
        "32x32": string;
      };
    };
  };
  image: string;
  images: {
    "282x218": string;
    "216x163": string;
    "200x200": string;
    "144x108": string;
    "135x102": string;
    "100x80": string;
  };
  history: {
    created: string;
    modified: string;
    shared: string;
  };
  stats: {
    views: number;
    loves: number;
    favorites: number;
    remixes: number;
  };
  remix: {
    parent: null;
    root: null;
  };
  project_token: string;
}

export async function ScratchAPIGetProjectInfo(id: number): Promise<APIGetProjectInfo> {
  const res = await fetch(`https://api.scratch.mit.edu/projects/${id}`);
  const json = await res.json();
  return json;
}
