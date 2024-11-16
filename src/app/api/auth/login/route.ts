import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const header = await req.headers;
  const authorization = header.get("authorization")?.split(" ")[1];

  if (!authorization) {
    return NextResponse.json(
      { ok: false, message: "トークンが必要です" },
      { status: 401 }
    );
  }
  if (authorization !== process.env.SCPAY_SECRET_KEY) {
    return NextResponse.json(
      { ok: false, message: "無効なトークンです" },
      { status: 403 }
    );
  }

  const supabase = createClient(); // クライアントを作成

  // req.json()を使用してリクエストボディを取得
  const { email, password, expiresIn } = await req.json();

  // ユーザーを Supabase で検索
  const { data: user, error } = await supabase
    .from("users")
    .select("id, encrypted_password")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json(
      {
        ok: false,
        message: "ユーザーが存在しません",
        error: error,
        error_message: error.message,
      },
      { status: 400 }
    );
  }

  // パスワードを照合
  const isPasswordValid = await bcrypt.compare(
    password,
    user.encrypted_password
  );
  if (!isPasswordValid) {
    return NextResponse.json(
      { ok: false, message: "パスワードが正しくありません" },
      { status: 400 }
    );
  }

  // JWTを発行
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: expiresIn || "30d" }
  );
  return NextResponse.json(
    { ok: true, message: "ログイン成功", data: token },
    { status: 200 }
  );
}
