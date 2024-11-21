"use client";

import React, { useEffect, useState } from "react";
import { XAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScPayUserType } from "@/utils/supabase/scpay";
import { ChartArea, ChartColumnBig, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@nextui-org/react";
import { getScPayAlldata } from "@/utils/supabase/scpay/req";

const chartConfig = {
  registrations: {
    label: "登録",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function AccountRegistrations() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountRegistrationsData, setAccountRegistrationsData] = useState<
    { month: string; registrations: number }[]
  >([]);
  const [period, setPeriod] = useState<string>("");

  const [chartType, setChartType] = useState<"bar" | "area">("bar");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const response = await getScPayAlldata("users")
      if (response) {
        const data: ScPayUserType[] = response.data;

        if (data) {
          // 現在の月を取得し、1年前の開始月を12月に固定
          const currentDate = new Date();
          const currentMonth = currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          const lastYearDate = new Date(currentDate.getFullYear() - 1, 11); // 1年前の12月
          const lastYearMonth = lastYearDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          setPeriod(`${lastYearMonth} ~ ${currentMonth}`);

          // 現在の月から12か月分の月名を初期化
          const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleString("default", { month: "long" });
          }).reverse();
          // 月ごとにデータをグループ化し、存在しない月は0で初期化
          const monthlyData = months.reduce((acc, month) => {
            acc[month] = 0; // 初期値を0に設定
            return acc;
          }, {} as Record<string, number>);
          data.forEach((user) => {
            const month = new Date(user.created_at).toLocaleString("default", {
              month: "long",
            });
            if (monthlyData[month] !== undefined) {
              monthlyData[month] += 1;
            }
          });

          // 配列に整形
          const formattedData = Object.keys(monthlyData).map((month) => ({
            month,
            registrations: monthlyData[month],
          }));
          setAccountRegistrationsData(formattedData);
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

  function Chart() {
    if (chartType === "area") {
      return (
        <ChartContainer className="w-full max-h-[300px]" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={accountRegistrationsData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="registrations"
              type="linear"
              fillOpacity={0.4}
              fill="var(--color-registrations)"
              stroke="var(--color-registrations)"
              radius={8}
            />
          </AreaChart>
        </ChartContainer>
      );
    }

    return (
      <ChartContainer className="w-full max-h-[300px]" config={chartConfig}>
        <BarChart
          data={accountRegistrationsData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent label />} />
          <Bar
            dataKey="registrations"
            fill="var(--color-registrations)"
            radius={8}
          />
        </BarChart>
      </ChartContainer>
    );
  }

  function ChartContent() {
    if (loading) {
      return <Skeleton className="w-full h-full min-h-48 rounded-lg" />;
    }
    if (errorMessage) {
      return (
        <div className="flex justify-center items-center w-full h-full rounded-lg mx-auto aspect-square max-h-[250px]">
          <span className="text-gray-500">{errorMessage}</span>
        </div>
      );
    }

    return <Chart />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row flex-wrap justify-between items-start">
        <div className="flex flex-col">
          <CardTitle>新規ユーザー</CardTitle>
          <CardDescription>月別新規ユーザー登録数</CardDescription>
        </div>
        <div className="flex flex-col">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-neutral-500/20 hover:backdrop-blur-sm  p-2 rounded-lg transition-all duration-300 ease-in-out">
                {chartType === "bar" && <ChartColumnBig />}
                {chartType === "area" && <ChartArea />}
                <span className="sr-only">チャートタイプの変更</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit min-w-2">
              <DropdownMenuItem onClick={() => setChartType("bar")}>
                <ChartColumnBig />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("area")}>
                <ChartArea />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContent />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {period} <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AccountRegistrations;
