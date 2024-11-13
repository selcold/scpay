import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  // 入力チェック
  if (!email || !password) {
    return NextResponse.json(
      { message: "メールアドレスとパスワードを入力してください" },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新規ユーザーをSupabaseのusersテーブルに追加
    const { error } = await supabase.from("users").insert([
      {
        username,
        email,
        password_hash: hashedPassword,
        profile: {
          image:
            "https://mtthwkpbwxbzwwwwfefl.supabase.co/storage/v1/object/public/profile-pictures/avatar.png",
        },
      },
    ]);

    if (error) {
      return NextResponse.json(
        {
          message: "ユーザー登録中にエラーが発生しました",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "ユーザー登録が成功しました" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "サーバーエラーが発生しました",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
