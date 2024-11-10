
import { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: string | JwtPayload; // JWT のペイロードが文字列またはオブジェクトであることを想定
  }
}