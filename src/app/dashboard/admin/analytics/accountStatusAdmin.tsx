"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScPayUserType } from "@/utils/supabase/scpay";
import { Skeleton } from "@nextui-org/react";
import { getScPayAlldata } from "@/utils/supabase/scpay/req";

const chartAccountStatusDataConfig = {
  status: {
    label: "Status",
  },
  admin: {
    label: "Admin",
    color: "hsl(var(--chart-1))",
  },
  user: {
    label: "User",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function AccountStatusAdmin() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountCount, setAccountCount] = useState<number>(0);
  const [accountStatusData, setAccountStatusData] = useState<
    {
      status: string;
      value: number;
      fill: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const response = await getScPayAlldata("users")
      if (response) {
        const data: ScPayUserType[] = response.data;

        if (data) {
          setAccountCount(data.length);

          // Statusごとのデータ集計
          const statusCount = data.reduce(
            (acc, user) => {
              const status = user.admin ? "admin" : "user";
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            },
            { admin: 0, user: 0 } as Record<string, number>
          );
          // 円グラフ用データを生成
          const formattedStatusData = Object.keys(statusCount).map(
            (status) => ({
              status: status,
              value: statusCount[status],
              fill: `var(--color-${status})`,
            })
          );
          setAccountStatusData(formattedStatusData);
        } else {
          setErrorMessage("ユーザーデータが存在しません");
        }
      } else {
        const errorData = await response.json();
        console.warn("取得エラー:", errorData.message, errorData.error);
        setErrorMessage(errorData.message || "データ取得に失敗しました");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  function ChartContent() {
    if (loading) {
      return (
        <Skeleton className="w-full h-full rounded-lg mx-auto aspect-square max-h-[250px]" />
      );
    }

    if (errorMessage) {
      return (
        <div className="flex justify-center items-center w-full h-full rounded-lg mx-auto aspect-square max-h-[250px]">
          <span className="text-gray-500">{errorMessage}</span>
        </div>
      );
    }

    return (
      <ChartContainer
        config={chartAccountStatusDataConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Pie
            data={accountStatusData}
            dataKey="value"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const linkedStatus = accountStatusData.find(
                    (data) => data.status === "admin"
                  );
                  const linkedCount = linkedStatus ? linkedStatus.value : 0;
                  const linkedPercentage =
                    accountCount > 0
                      ? Math.floor((linkedCount / accountCount) * 100)
                      : 0;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {linkedPercentage}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Admin
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理者アカウント分布</CardTitle>
        <CardDescription>管理者と通常ユーザーの割合</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContent />
      </CardContent>
    </Card>
  );
}

export default AccountStatusAdmin;
