import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

// JWT認証ミドルウェア（API専用）
export const authMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "トークンが見つかりません" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded; // `req.user`にユーザー情報を設定
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "認証が無効です", error });
    }
  };

// ミドルウェア（ページ遷移の前に認証処理を実行）
export async function middleware(request: NextRequest) {
  // // パスワード認証の処理
  // const password = process.env.SITE_PASSWORD; // 環境変数からパスワードを取得
  // const cookieStore = await cookies();
  // const authCookie = cookieStore.get("auth-token");

  // if (request.nextUrl.pathname === "/password") {
  // } else {
  //   // クッキーに認証トークンがない場合、パスワードを要求
  //   if (!authCookie) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/password"; // パスワード入力ページにリダイレクト
  //     return NextResponse.redirect(url);
  //   }
  // }

  // 認証トークンがあれば、そのまま次の処理へ進む
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname); // カスタムヘッダー設定
  return response;
}

// APIルートで使用するJWT認証ミドルウェアの設定
export const config = {
  matcher: [
    // ここでは認証をかけるべきルートを指定
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
