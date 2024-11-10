"use client";

import React, { useState } from "react";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { User } from "@/hooks/useUser";

function DataList({ scpay_user }: { scpay_user: User | null }) {
  const [localUser, setLocalUser] = useState<User | null>(scpay_user);

  if (!localUser) {
    return null;
  }

  // userオブジェクトのキーと値を行として使用
  const rows = Object.keys(localUser).map((key) => ({
    key,
    item: key,
    data:
      typeof localUser[key as keyof typeof localUser] === "object"
        ? JSON.stringify(localUser[key as keyof typeof localUser], null, 2)
        : localUser[key as keyof typeof localUser],
  }));

  const columns = [
    {
      key: "item",
      label: "ITEM",
    },
    {
      key: "data",
      label: "DATA",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-start">
      <div className="flex flex-col mb-5">
        <h1 className="font-bold text-xl md:!text-2xl">アカウント情報</h1>
      </div>
      <Table
        color="primary"
        selectionMode="single"
        aria-label="ユーザー情報テーブル"
        className="container overflow-x-scroll"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows} emptyContent={"表示するデータがありません"}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataList;
