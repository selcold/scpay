"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { Button, Input, Link } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderRound } from "@/components/ui/loading";
import { useUser } from "@/hooks/useUser";
import { setCookie } from "cookies-next/client";

function SignUpPage() {
  const { user, loading } = useUser();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // バリデーション用のスキーマを定義
  const schema = z.object({
    username: z
      .string()
      .min(3, "3文字以上で入力してください")
      .max(15, "15文字以内で入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "8文字以上で入力してください")
      .max(20, "20文字以内で入力してください"),
  });
  // useForm を使ってバリデーションと入力管理を実装
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setFormLoading(true);
    // サインアップ API を呼び出してユーザーを作成
    const signUpResponse = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    const signUpData = await signUpResponse.json();

    if (signUpResponse.ok) {
      // サインアップ成功後にログイン API を呼び出してJWTを取得
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email, // サインアップ時と同じメールアドレスを使用
          password: data.password, // サインアップ時のパスワードを使用
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        setCookie("scpay-account-token", loginData.token, {
          maxAge: 2592000,
        });
        // // JWTトークンをローカルストレージに保存
        // localStorage.setItem("scpay-account-token", loginData.token);
        console.log("ログイン成功");
        redirect("/dashboard"); // ログイン後、ダッシュボードにリダイレクト
      } else {
        console.warn("ログインエラー:", loginData.message);
        setError(loginData.message || "ログインに失敗しました");
      }
    } else {
      console.warn("サインアップエラー:", signUpData.message);
      setError(signUpData.message || "サインアップに失敗しました");
    }

    setFormLoading(false);
  };

  if (loading) {
    return <LoaderRound />;
  }

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full min-h-dvh">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center w-full"
      >
        <div className="hidden md:!flex justify-center items-center w-1/2 h-dvh">
          <h1 className="font-bold text-2xl">ScPay</h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:!w-1/2 h-dvh p-5 bg-neutral-100 dark:bg-neutral-900">
          <div className="flex md:!hidden justify-center items-center mb-10">
            <h1 className="font-bold text-2xl">ScPay</h1>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 w-fit">
            <h1 className="font-bold text-xl md:!text-2xl lg:!text-3xl text-center mb-5">
              新規アカウントを作成する
            </h1>
            <Input
              {...register("username")}
              isRequired
              variant="faded"
              placeholder="guest"
              label="Username"
              type="text"
              className="max-w-xs"
              color={errors.username ? "danger" : "success"}
              isInvalid={errors.username ? true : false}
              errorMessage={errors.username?.message as string | undefined}
            />
            <Input
              {...register("email")}
              isRequired
              variant="faded"
              placeholder="guest@example.com"
              label="Email"
              type="email"
              className="max-w-xs"
              color={errors.email ? "danger" : "success"}
              isInvalid={errors.email ? true : false}
              errorMessage={errors.email?.message as string | undefined}
            />
            <Input
              {...register("password")}
              isRequired
              label="Password"
              variant="faded"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
              color={errors.password ? "danger" : "success"}
              isInvalid={errors.password ? true : false}
              errorMessage={errors.password?.message as string | undefined}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <Button
              type="submit"
              className="bg-blue-600 text-white w-full max-w-52 md:!max-w-80 px-10 py-2 rounded-lg shadow-md shadow-blue-800 hover:opacity-50 active:scale-95 transition-all duration-300 ease-in-out"
              isLoading={formLoading}
            >
              Sign up
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center mt-5 text-sm">
            <span className="text-neutral-400 mr-2">
              アカウントをお持ちですか？
            </span>
            <Link className="text-blue-500" href="/login" size="sm">
              ログインする
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
