import { UUID } from "crypto";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    users: ScPayUserType[];
    error_codes: ErrorCodeType[];
    news: NewsType[];
  };
}

export interface ScPayUserType {
  id: number;
  user_id: UUID;
  username: string;
  role:
    | {
        label: string;
        color: string;
      }[]
    | null;
  email: string;
  encrypted_password: string;
  invited_at: Date | null;
  email_change: string | null;
  last_sign_in_at: Date | null;
  is_super_admin: boolean; // default false
  admin: boolean; // default false
  created_at: Date;
  updated_at: Date | null;
  email_change_confirm_status: boolean | null;
  banned_until: Date | null;
  deleted_at: Date | null;
  scratch: string | null;
  status: string; // default active
  profile: {
    image: string;
    background?: {
      image?: string;
    };
  };
  history: Record<string, any> | null;
  connection: Record<string, any> | null;
  achievements: Record<string, any> | null;
}

export interface ErrorCodeType {
  code: string;
  message: string;
  category: string;
  description: string;
  status_code: number;
  created_at: Date;
  updated_at: Date;
}

export interface NewsType {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}
