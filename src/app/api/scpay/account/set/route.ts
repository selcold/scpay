import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function PATCH(req: NextRequest) {
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
  const { userId, item, data } = await req.json();

  const supabase = createClient();

  try {
    // ユーザーが指定されているか確認
    if (!userId || !item) {
      return NextResponse.json(
        {
          ok: false,
          message: "ユーザーID、項目、およびデータが必要です",
        },
        { status: 400 }
      );
    }

    const update_date = new Date();

    // 指定された項目に基づいてデータを更新
    const { error } = await supabase
      .from("users")
      .update({ [item]: data, updated_at: update_date }) // item に基づいてデータを動的に更新
      .eq("id", userId); // userId に基づいて特定のユーザーを更新

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            message: `既に使用されています"`,
            error: error,
            error_massage: error.message,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          message: "データの設定中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "データの設定が成功しました" },
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
