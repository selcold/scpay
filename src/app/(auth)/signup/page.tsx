"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import {
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderRound } from "@/components/ui/loading";
import { useScPayUser } from "@/hooks/useScPayUser";
import { setCookie } from "cookies-next/client";
import PrivacyPolicyContent from "@/app/dashboard/(root)/privacy_policy/getContent";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";

function SignUpPage() {
  const { user, loading } = useScPayUser();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isOpen: isOpen_termsOfUse,
    onOpen: onOpen_termsOfUse,
    onOpenChange: onOpenChange_termsOfUse,
  } = useDisclosure();
  const [ok_termsOfUse, setOk_termsOfUse] = useState<boolean | undefined>(
    undefined
  );
  const {
    isOpen: isOpen_privacyPolicy,
    onOpen: onOpen_privacyPolicy,
    onOpenChange: onOpenChange_privacyPolicy,
  } = useDisclosure();
  const [ok_privacyPolicy, setOk_privacyPolicy] = useState<boolean | undefined>(
    undefined
  );

  // バリデーション用のスキーマを定義
  const schema = z.object({
    username: z
      .string()
      .min(3, "3文字以上で入力してください")
      .max(30, "30文字以内で入力してください"),
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
    setError(null)
    // 利用規約とプライバシーポリシーに同意していない場合はサインアップを中止
    if (!ok_termsOfUse || !ok_privacyPolicy) {
      setError("利用規約とプライバシーポリシーに同意する必要があります");
      setFormLoading(false);
      return;
    }

    const signUpResponse = await reqScPayAPI({
      url: "/api/auth/signup",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    if (signUpResponse.ok) {
      const loginResponse = await reqScPayAPI({
        url: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          expiresIn: 2592000,
        }),
      });
      if (loginResponse.ok) {
        setCookie("scpay-account-token", loginResponse.data, {
          maxAge: 2592000,
        });
        console.log("ログイン成功");
        redirect("/dashboard"); // ログイン後、ダッシュボードにリダイレクト
      } else {
        console.warn("ログインエラー:", loginResponse.message);
        setError(loginResponse.message || "ログインに失敗しました");
      }
    } else {
      console.warn(
        "サインアップエラー:",
        signUpResponse.message,
        signUpResponse.error
      );
      setError(signUpResponse.message || "サインアップに失敗しました");
    }

    setFormLoading(false);
  };

  if (loading) {
    return <LoaderRound />;
  }

  if (user) {
    redirect("/dashboard");
  }

  function ModalContents() {
    return (
      <div>
        <Modal
          backdrop="blur"
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen_termsOfUse}
          onOpenChange={onOpenChange_termsOfUse}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  利用規約
                </ModalHeader>
                <ModalBody>
                  <p>{/**省略 */}</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setOk_termsOfUse(false);
                      onClose();
                    }}
                  >
                    同意しない
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      setOk_termsOfUse(true);
                      onClose();
                    }}
                  >
                    同意する
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpen_privacyPolicy}
          onOpenChange={onOpenChange_privacyPolicy}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          backdrop="blur"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  プライバシポリシー
                </ModalHeader>
                <ModalBody>
                  <PrivacyPolicyContent />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setOk_privacyPolicy(false);
                      onClose();
                    }}
                  >
                    同意しない
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      setOk_privacyPolicy(true);
                      onClose();
                    }}
                  >
                    同意する
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
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
            <div className="flex flex-col justify-center items-center gap-3 w-full mb-5">
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
              <div className="group flex flex-col gap-2 data-[hidden=true]:hidden w-full max-w-xs px-2">
                <button
                  className="flex justify-start items-center"
                  onClick={onOpen_termsOfUse}
                >
                  <Checkbox
                    value="terms_of_use"
                    isSelected={ok_termsOfUse}
                    isRequired
                    isReadOnly
                  />
                  利用規約に同意
                </button>
                <button
                  className="flex justify-start items-center"
                  onClick={onOpen_privacyPolicy}
                >
                  <Checkbox
                    value="privacy_policy"
                    isSelected={ok_privacyPolicy}
                    isRequired
                    isReadOnly
                  />
                  プライバシポリシーに同意
                </button>
              </div>
              {error && (
                <div className="group flex flex-col gap-2 data-[hidden=true]:hidden w-full max-w-xs text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
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
        <ModalContents />
      </form>
    </div>
  );
}

export default SignUpPage;
