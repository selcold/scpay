import jwt, { JwtPayload } from "jsonwebtoken";
import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const header = await req.headers;
  const token = header.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "トークンが必要です" },
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
        { message: "ユーザーが見つかりません" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "無効なトークンです" },
      { status: 403 }
    );
  }
}
