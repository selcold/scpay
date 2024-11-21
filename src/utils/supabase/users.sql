create table
  public.users (
    id SERIAL PRIMARY KEY, -- 登録ID
    user_id character varying(30) not null UNIQUE CHECK (user_id ~ '^[A-Za-z0-9]+$'), -- ユーザーID（半角英数字のみ）
    username character varying(30) not null, -- ユーザー名
    role jsonb null, -- ロール
    email character varying(200) not null UNIQUE, -- メールアドレス
    encrypted_password text not null, -- パスワード
    invited_at timestamp with time zone null, -- 招待
    email_change character varying(200) null, -- メールアドレス変更
    last_sign_in_at timestamp with time zone null, -- 最終ログイン日時
    is_super_admin boolean not null default false, -- スパー管理者
    admin boolean not null default false, -- 管理者
    created_at timestamp with time zone not null default current_timestamp, -- 登録日時
    updated_at timestamp with time zone null default current_timestamp, -- 更新日時
    email_change_confirm_status boolean null default false, -- メールアドレス変更確認
    banned_until timestamp with time zone null, -- アカウント停止開始日
    deleted_at timestamp with time zone null, -- アカウント削除日時
    scratch text null, -- Scratchアカウント名
    status text not null default 'active'::text, -- アカウントステータス
    profile jsonb null, -- プロフィール情報
    history jsonb null,
    connection jsonb null,
    achievements jsonb null
  );