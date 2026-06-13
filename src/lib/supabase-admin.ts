import { createClient } from "@supabase/supabase-js";

// サーバー専用クライアント。SERVICE_ROLE_KEY を使うため RLS をバイパスする。
// 絶対にクライアントコンポーネントから import しないこと。
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  }
);
