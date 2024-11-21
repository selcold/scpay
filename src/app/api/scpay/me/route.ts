import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const header = await req.headers;
  const token = header.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "トークンが必要です" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload; // JwtPayloadとして型アサーション
    const supabase = createClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("*") // 必要な情報を取得
      .eq("id", decoded.userId) // decoded.userIdにアクセス
      .single();

    if (user) {
      delete user.password_hash; // password_hashを除去
    }

    if (error || !user) {
      return NextResponse.json(
        {
          ok: false,
          message: "ユーザーが見つかりません",
          error: error,
          error_massage: error?.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: user }, { status: 200 });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return NextResponse.json(
        {
          ok: false,
          message: "トークンの有効期限が切れています",
          error: err,
          error_massage: err.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "無効なトークンです",
        error: err,
        error_massage: err,
      },
      { status: 403 }
    );
  }
}
