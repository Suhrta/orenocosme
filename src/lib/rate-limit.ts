import { supabaseAdmin } from "./supabase-admin";

/**
 * 固定ウィンドウ方式のレート制限チェック。
 * Supabase の check_rate_limit 関数をアトミックに呼び出す。
 *
 * インフラ障害時（テーブル未作成・接続失敗など）は fail-open（許可）する。
 * レート制限の不調で診断機能そのものを止めないための判断。
 *
 * @returns true = 許可 / false = 上限超過
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("Rate limit RPC error:", error.message);
      return true; // fail-open
    }
    return data === true;
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return true; // fail-open
  }
}

/**
 * リクエストヘッダーから接続元IPを推定する。
 * Vercel/プロキシ環境では x-forwarded-for の先頭が実クライアントIP。
 */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
