// src/components/scpay/set.ts

export async function ScPayAccountSET(
  userId: number,
  item: string,
  data: string | null
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // API エンドポイントにPOSTリクエストを送信
    const response = await fetch("/api/auth/account/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, item, data }),
    });

    // レスポンスのステータスを確認
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message,
        error: errorData.error,
      };
    }

    const result = await response.json();
    return { success: true, message: result.message };
  } catch (error) {
    // エラーハンドリング
    return {
      success: false,
      message: "リクエスト中にエラーが発生しました",
      error: (error as Error).message,
    };
  }
}
