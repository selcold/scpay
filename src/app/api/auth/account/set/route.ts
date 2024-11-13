import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
  const { userId, item, data } = await req.json();

  const supabase = createClient();

  try {
    // ユーザーが指定されているか確認
    if (!userId || !item) {
      return NextResponse.json(
        {
          message: "ユーザーID、項目、およびデータが必要です",
        },
        { status: 400 }
      );
    }

    // 指定された項目に基づいてデータを更新
    const { error } = await supabase
      .from("users")
      .update({ [item]: data }) // item に基づいてデータを動的に更新
      .eq("id", userId); // userId に基づいて特定のユーザーを更新

    if (error) {
      return NextResponse.json(
        {
          message: "データの設定中にエラーが発生しました",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "データの設定が成功しました" },
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
