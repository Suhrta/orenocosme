-- =============================================
-- rate_limits: 固定ウィンドウ方式のレート制限カウンタ
-- service_role からのみアクセス（RLS有効・ポリシーなし）
-- =============================================
create table if not exists rate_limits (
  key text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);

alter table rate_limits enable row level security;
-- ポリシーを定義しない = anon/public からは読めない。
-- service_role は RLS をバイパスするためサーバー側からのみ操作可能。

-- =============================================
-- check_rate_limit: 1リクエストをアトミックに記録し、上限内かを返す
--   p_key            … 識別キー（例: "diag:burst:<ip>"）
--   p_max            … ウィンドウ内の最大許可回数
--   p_window_seconds … ウィンドウ長（秒）
--   返り値 true = 許可 / false = 上限超過
-- =============================================
create or replace function check_rate_limit(
  p_key text,
  p_max int,
  p_window_seconds int
)
returns boolean
language plpgsql
as $$
declare
  v_count int;
begin
  insert into rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set
      count = case
        when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then 1
          else rate_limits.count + 1
      end,
      window_start = case
        when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then now()
          else rate_limits.window_start
      end
  returning count into v_count;

  return v_count <= p_max;
end;
$$;
