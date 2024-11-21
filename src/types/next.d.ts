import { JwtPayload } from "jsonwebtoken";

declare module "next" {
  interface NextApiRequest {
    user?: string | JwtPayload; // JWT のペイロードが文字列またはオブジェクトであることを想定
  }
}
