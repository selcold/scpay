import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createClient } from "@/utils/supabase/client";

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

  const { username, email, password } = await req.json();

  // 入力チェック
  if (!username || !email || !password) {
    return NextResponse.json(
      {
        ok: false,
        message: "ユーザー名,メールアドレス,パスワードを入力してください",
      },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    function generateUserId(length = 30) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    const userId = username + generateUserId(30 - (username as string).length);

    // 新規ユーザーをSupabaseのusersテーブルに追加
    const { error } = await supabase.from("users").insert([
      {
        username: username,
        user_id: userId,
        email: email,
        encrypted_password: hashedPassword,
        profile: {
          image:
            "https://mtthwkpbwxbzwwwwfefl.supabase.co/storage/v1/object/public/profile-pictures/avatar.png",
        },
      },
    ]);

    if (error) {
      // 既に登録されているメールアドレスによるエラーかを判定
      if (error.message.includes("duplicate key value")) {
        if (error.message.includes("users_username_key")) {
          return NextResponse.json(
            {
              ok: false,
              message: "このユーザー名はすでに使用されています",
            },
            { status: 400 }
          );
        }
        if (error.message.includes("users_email_key")) {
          return NextResponse.json(
            {
              ok: false,
              message: "このメールアドレスはすでに使用されています",
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        {
          ok: false,
          message: "ユーザー登録中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "ユーザー登録が成功しました" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "サーバーエラーが発生しました",
        error: error as Error,
      },
      { status: 500 }
    );
  }
}
