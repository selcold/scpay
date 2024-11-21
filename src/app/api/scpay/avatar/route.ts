// src/app/api/upload-avatar/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
  const header = await request.headers;
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
    const formData = await request.formData();
    const userId = formData.get("userId");
    const file = formData.get("file");

    // ファイルが存在するか確認
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { ok: false, message: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    // サイズ制限（512KB以下）
    if (file.size > 512 * 1024) {
      return NextResponse.json(
        { ok: false, message: "画像のサイズは512KB以下にしてください" },
        { status: 400 }
      );
    }

    // Supabaseにアップロード
    const fileName = `avatar-${userId}`;
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file, { upsert: true });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "画像のアップロードに失敗しました",
          error: error,
          error_massage: error.message,
        },
        { status: 500 }
      );
    }

    // 画像URLの生成
    const imageUrl = `https://mtthwkpbwxbzwwwwfefl.supabase.co/storage/v1/object/public/profile-pictures/${data.path}`;

    const update_date = new Date();

    // ユーザー情報を更新する（仮にIDがユーザーに紐付いていると仮定）
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile: { image: imageUrl }, updated_at: update_date })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { ok: false, message: "ユーザー情報の更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: imageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "サーバーエラーが発生しました",
        error: error,
        error_massage: error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const header = await request.headers;
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
    const req = await request.json();

    if (!req.imageUrl) {
      return NextResponse.json(
        { ok: false, message: "画像URLが指定されていません" },
        { status: 400 }
      );
    }

    if (
      req.imageUrl ===
      "https://mtthwkpbwxbzwwwwfefl.supabase.co/storage/v1/object/public/profile-pictures/avatar.png"
    ) {
      return NextResponse.json(
        { ok: false, message: "デフォルトアイコンは削除出来ません" },
        { status: 400 }
      );
    }

    // Supabaseから画像を削除
    const fileName = req.imageUrl.split("/").pop();
    if (fileName) {
      const { error } = await supabase.storage
        .from("profile-pictures")
        .remove(fileName);

      if (error) {
        return NextResponse.json(
          {
            ok: false,
            message: "画像の削除に失敗しました",
            error: error,
            error_massage: error.message,
          },
          { status: 500 }
        );
      }

      const update_date = new Date();

      // ユーザー情報の更新
      const { error: updateError } = await supabase
        .from("users")
        .update({
          profile: {
            image:
              "https://mtthwkpbwxbzwwwwfefl.supabase.co/storage/v1/object/public/profile-pictures/avatar.png",
          },
          updated_at: update_date
        })
        .eq("id", req.userId);

      if (updateError) {
        return NextResponse.json(
          { ok: false, message: "ユーザー情報の更新に失敗しました" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { ok: true, message: "画像が削除されました" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "不正な画像URLです" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "サーバーエラーが発生しました",
        error: error,
        error_massage: error,
      },
      { status: 500 }
    );
  }
}
