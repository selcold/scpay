"use client";

import { useScPayUser } from "@/hooks/useScPayUser";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Pencil, PencilOff, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CustomCard,
  CustomCardBody,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "./customCard";
import { Skeleton } from "@nextui-org/react";
import toast from "react-hot-toast";

export function AccountSettingUserId() {
  const { user, loading } = useScPayUser();
  const [formLoading, setFormLoading] = useState(false);
  const [formNewData, setFormNewData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState(false);
  const toggleEdit = () => setIsEdit(!isEdit);

  const schema = z.object({
    user_id: z
      .string()
      .regex(/^[A-Za-z0-9]*$/, "半角英数字のみで入力してください")
      .min(3, "3文字以上で入力してください")
      .max(30, "30文字以内で入力してください"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setFormLoading(true);
    setError(null);

    const res = await reqScPayAPI({
      url: "/api/scpay/account/set",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        item: "user_id",
        data: data.user_id,
      }),
    });

    if (res.ok) {
      console.log("データの更新が完了しました");
      toast.success("ユーザーIDの変更が完了しました");
      setIsEdit(false);
    } else {
      console.warn("更新エラー:", res.message, res.error);
      setError(res.message || "データの更新に失敗しました");
    }

    setFormLoading(false);
  };

  if (loading || !user) {
    return (
      <CustomCard>
        <CustomCardHeader className="flex flex-col gap-3">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-2/3 h-6 rounded-lg" />
          <Skeleton className="w-1/3 h-6 rounded-lg" />
        </CustomCardHeader>
        <CustomCardBody>
          <Skeleton className="w-full h-9 rounded-lg" />
        </CustomCardBody>
      </CustomCard>
    );
  }

  return (
    <form
      className="flex flex-col w-full h-full "
      onSubmit={handleSubmit(onSubmit)}
    >
      <CustomCard>
        <CustomCardHeader>
          <CustomCardTitle>ユーザーID</CustomCardTitle>
          <CustomCardDescription>
            ご自身やご自分のコンテンツを示すユーザーIDを入力してください。
          </CustomCardDescription>
        </CustomCardHeader>
        <CustomCardBody className="gap-2 flex-col sm:!flex-row">
          <Input
            {...register("user_id")}
            value={isEdit ? formNewData || user.user_id : user.user_id}
            variant="faded"
            labelPlacement="outside"
            isRequired
            isReadOnly={!isEdit}
            isDisabled={formLoading}
            isInvalid={isEdit && errors.user_id ? true : false}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleEdit}
                aria-label="toggle password visibility"
              >
                {isEdit ? (
                  <PencilOff
                    className="text-2xl text-default-400 pointer-events-none"
                    onClick={reset}
                  />
                ) : (
                  <Pencil className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            onValueChange={setFormNewData}
          />
          {isEdit && (
            <Button
              type="submit"
              isIconOnly
              isLoading={formLoading}
              className="w-full sm:!w-fit"
            >
              <Save />
            </Button>
          )}
        </CustomCardBody>
      </CustomCard>
      {isEdit && (errors.user_id?.message as string) && (
        <p className="text-red-500 text-sm">
          {errors.user_id?.message as string}
        </p>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
}
