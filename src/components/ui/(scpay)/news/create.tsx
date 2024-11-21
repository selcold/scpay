"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reqScPayAPI } from "@/utils/supabase/scpay/req";
import toast from "react-hot-toast";
import { ScPayAdminProviderContent } from "@/components/admin/block";

export function NewsCreateButton() {
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const schema = z.object({
    title: z.string(),
    description: z.string(),
  });
  // useForm を使ってバリデーションと入力管理を実装
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any, onClose: () => void) => {
    setFormLoading(true);
    setError(null);
    const response = await reqScPayAPI({
      url: "/api/scpay/news",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });
    if (response.ok) {
      console.log("新規作成しました");
      toast.success(response.message || "新規ニュースを作成しました");
      onClose();
    } else {
      console.warn("作成エラー:", response.message, response.error);
      setError(response.message || "新規作成に失敗しました");
    }
    setFormLoading(false);
  };

  return (
    <ScPayAdminProviderContent>
      <div className="flex justify-center items-center">
        <Button onPress={onOpen}>新規ニュースを作成</Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
                <ModalHeader className="flex flex-col gap-1">
                  新規ニュースを作成
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...register("title")}
                    label="Title"
                    placeholder="ニュースを作成"
                    variant="bordered"
                    color={errors.title ? "danger" : "success"}
                    isInvalid={errors.title ? true : false}
                    errorMessage={errors.title?.message as string | undefined}
                  />
                  <Textarea
                    {...register("description")}
                    label="Description"
                    placeholder="新規ニュースを作成しました。"
                    disableAnimation
                    disableAutosize
                    variant="bordered"
                    color={errors.description ? "danger" : "success"}
                    isInvalid={errors.description ? true : false}
                    errorMessage={
                      errors.description?.message as string | undefined
                    }
                    classNames={{
                      base: "w-full",
                      input: "resize-y min-h-[40px]",
                    }}
                  />
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    閉じる
                  </Button>
                  <Button color="primary" type="submit" isLoading={formLoading}>
                    作成
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </div>
    </ScPayAdminProviderContent>
  );
}
