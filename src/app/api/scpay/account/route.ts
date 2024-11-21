import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
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

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const supabase = createClient();

  try {
    // ユーザーが指定されているか確認
    if (!userId) {
      return NextResponse.json(
        {
          ok: false,
          message: "ユーザーIDが必要です",
        },
        { status: 400 }
      );
    }

    // 指定された項目に基づいてデータを更新
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "データの取得中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "データの取得が成功しました", data: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "サーバーエラーが発生しました",
        error: error as Error,
        error_message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
