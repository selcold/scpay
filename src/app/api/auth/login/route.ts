import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient(); // クライアントを作成

  // req.json()を使用してリクエストボディを取得
  const { email, password } = await req.json();

  // ユーザーを Supabase で検索
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password_hash")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { message: "ユーザーが存在しません" },
      { status: 400 }
    );
  }

  // パスワードを照合
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: "パスワードが正しくありません" },
      { status: 400 }
    );
  }

  // JWTを発行
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  return NextResponse.json({ token }, { status: 200 });
}
