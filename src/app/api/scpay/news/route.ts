import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

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

  const supabase = createClient();

  // URLパラメータから取得数を指定するクエリを解析
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); // デフォルトで10件
  const offset = parseInt(url.searchParams.get("offset") || "0", 10); // デフォルトで0件目から

  try {
    if (id) {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            {
              ok: false,
              message: "データが存在しません",
              error: error,
              error_message: error.message,
            },
            { status: 500 }
          );
        }
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
    } else {
      // 指定された項目に基づいてデータを更新
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1); // 指定した範囲のデータを取得

      if (error) {
        console.log(error);
        if (error.code === "PGRST116") {
          return NextResponse.json(
            {
              ok: false,
              message: "データが存在しません",
              error: error,
              error_message: error.message,
            },
            { status: 500 }
          );
        }
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
    }
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

  const supabase = createClient();

  try {
    const { title, description, tags } = await req.json();

    if (!title) {
      return NextResponse.json(
        { ok: false, message: "タイトルは必須です" },
        { status: 400 }
      );
    }

    // 指定された項目に基づいてデータを更新
    const { error } = await supabase.from("news").insert([
      {
        title,
        description,
        tags,
      },
    ]);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "ニュースの作成中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "ニュースの作成が成功しました" },
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

  const supabase = createClient();

  try {
    const { id, title, description, tags } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ニュースIDは必須です" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, message: "タイトルは必須です" },
        { status: 400 }
      );
    }

    const update_date = new Date();

    // 指定された項目に基づいてデータを更新
    const { error } = await supabase
      .from("news")
      .update([
        {
          title,
          description,
          tags,
          updated_at: update_date,
        },
      ])
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "ニュースの更新中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "ニュースの更新が成功しました" },
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

export async function DELETE(req: NextRequest) {
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

  const supabase = createClient();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ニュースIDは必須です" },
        { status: 400 }
      );
    }

    // 指定された項目に基づいてデータを更新
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "ニュースの削除中にエラーが発生しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "ニュースの削除が成功しました" },
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
