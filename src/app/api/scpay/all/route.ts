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

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");

  const supabase = createClient();

  try {
    if (!from) {
      return NextResponse.json(
        {
          ok: false,
          message: "テーブルが必要です",
        },
        { status: 400 }
      );
    }

    if (typeof from !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "テーブル名は `string` 型です",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from(from).select("*");

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
        error_massage: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
