"use client";

import React, { useRef } from "react";
import { Link, Tab, Tabs } from "@nextui-org/react";
import { motion, useInView } from "motion/react";
import { useSearchParams } from "next/navigation";

interface PricingType {
  priceType?: "free" | "custom";
  label: string;
  description: string;
  contents?: string[];
  buttonText?: string;
  buttonURL?: string;
  popular?: boolean;
  comingSoon?: boolean;
  perYear?: string;
  perYearText?: string;
  perMonth?: string;
  perMonthText?: string;
}

function PriceCardNoCost({
  children,
  item,
}: {
  children: React.ReactNode;
  item: PricingType;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ",
      }}
      className="flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none bg-background/60 p-3 dark:bg-default-100/50"
      tabIndex={-1}
    >
      {item.popular && (
        <div className="max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full bg-blue-500/20 text-blue-500 absolute right-4 top-4">
          <span className="flex-1 text-inherit font-normal px-2">最も人気</span>
        </div>
      )}
      <div className="p-3 w-full justify-start shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large flex flex-col items-start gap-2 pb-6">
        <h2 className="text-large font-medium">{item.label}</h2>
        <p className="text-medium text-default-500">{item.description}</p>
      </div>
      <hr
        className="shrink-0 bg-divider border-none w-full h-divider"
        role="separator"
      />
      <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-8">
        {children}
        <ul className="flex flex-col gap-2">
          {item.contents?.map((content, idx) => {
            return (
              <li key={idx} className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="text-blue-500 iconify iconify--ci"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m6 12l4.243 4.243l8.484-8.486"
                  />
                </svg>
                <p className="text-default-500">{content}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-3 h-auto flex w-full items-center overflow-hidden color-inherit subpixel-antialiased rounded-b-large">
        <Link
          className="tap-highlight-transparent no-underline hover:opacity-80 active:opacity-disabled transition-opacity z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium w-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-blue-500/20 text-blue-500 data-[hover=true]:opacity-hover"
          tabIndex={0}
          href={item.buttonURL}
        >
          {item.buttonText || `${item.label}を始める`}
        </Link>
      </div>
      {item.comingSoon && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full rounded-lg backdrop-blur-lg bg-background/80">
          <h1>COMING SOON</h1>
        </div>
      )}
    </div>
  );
}

function HeroPricingContent() {
  const ref1 = useRef(null);
  const isInView1 = useInView(ref1, { once: true, margin: "-110px" });

  const searchParams = useSearchParams();
  const price_tab = searchParams.get("pricingTab");

  const pricing: PricingType[] = [
    {
      priceType: "free",
      label: "Free",
      description: "初心者や試してみたい愛好家向け。",
      contents: ["アカウントの連携"],
      popular: true,
      buttonText: "無料で続ける",
      buttonURL: "/signup",
    },
    {
      label: "Pro",
      description: "メンバーが 10 人未満の小規模チーム向けです。",
      buttonText: "始める",
      comingSoon: true,
      perYear: "---",
      perYearText: "年間",
      perMonth: "---",
      perMonthText: "月間",
    },
    {
      label: "Team",
      description: "10 人以上のメンバーがいる大規模なチーム向け。",
      buttonText: "お問い合わせ",
      comingSoon: true,
      perYear: "---",
      perYearText: "年間",
      perMonth: "---",
      perMonthText: "月間",
    },
  ];

  function PriceCardContent({ type }: { type?: "year" | "month" }) {
    if (type === "year") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeInOut",
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {pricing.map((item, index) => {
            return (
              <PriceCardNoCost key={index} item={item}>
                <p className="flex items-baseline gap-1 pt-2">
                  <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent">
                    {item.priceType === "free" ? "Free" : item.perYear}
                  </span>
                  {item.perYearText && (
                    <span className="text-small font-medium text-default-400">
                      /{item.perYearText}
                    </span>
                  )}
                </p>
              </PriceCardNoCost>
            );
          })}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: "easeInOut",
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pricing.map((item, index) => {
          return (
            <PriceCardNoCost key={index} item={item}>
              <p className="flex items-baseline gap-1 pt-2">
                <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent">
                  {item.priceType === "free" ? "Free" : item.perYear}
                </span>
                {item.perMonthText && (
                  <span className="text-small font-medium text-default-400">
                    /{item.perMonthText}
                  </span>
                )}
              </p>
            </PriceCardNoCost>
          );
        })}
      </motion.div>
    );
  }

  return (
    <div
      id="pricing"
      className="flex items-center min-h-screen justify-center p-4"
    >
      <div
        className="relative flex w-full h-full max-w-4xl flex-col items-center py-24"
        ref={ref1}
        style={{
          filter: isInView1 ? "blur(0px)" : "blur(10px)",
          transform: isInView1 ? "none" : "translateY(100px)",
          opacity: isInView1 ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        <div
          aria-hidden="true"
          className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl md:right-20 md:h-auto md:w-auto md:px-36"
        >
          <div
            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#7186ff] to-[#a9b8e9] opacity-30"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex max-w-xl flex-col text-center">
          <h2 className="font-medium leading-7 text-blue-500">価格</h2>
          <h1 className="text-4xl font-medium tracking-tight">
            無制限にアクセスできます
          </h1>
          <span
            aria-hidden="true"
            className="w-px h-px block"
            style={{ marginLeft: "0.25rem", marginTop: "1rem" }}
          />
          <h2 className="text-large text-default-500">
            理想的なプランを見つけましょう。
          </h2>
        </div>

        <span
          aria-hidden="true"
          className="w-px h-px block"
          style={{ marginLeft: "0.25rem", marginTop: "2rem" }}
        />

        <Tabs
          aria-label="pricing"
          radius="full"
          defaultSelectedKey={price_tab || "year"}
        >
          <Tab
            key="year"
            title={
              <div
                className="relative z-10 whitespace-nowrap transition-colors text-blue-500 group-data-[selected=true]:text-default-foreground"
                data-slot="tabContent"
              >
                <div className="flex items-center gap-2">
                  <p>年払い</p>
                  <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full bg-blue-500/20 text-blue-500">
                    <span className="flex-1 text-inherit font-normal px-2">
                      25%割引
                    </span>
                  </div>
                </div>
              </div>
            }
          >
            <span
              aria-hidden="true"
              className="w-px h-px block"
              style={{ marginLeft: "0.25rem", marginTop: "3rem" }}
            />
            <PriceCardContent type="year" />
          </Tab>
          <Tab
            key="month"
            title={
              <div
                className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-default-foreground"
                data-slot="tabContent"
              >
                月払い
              </div>
            }
          >
            <span
              aria-hidden="true"
              className="w-px h-px block"
              style={{ marginLeft: "0.25rem", marginTop: "3rem" }}
            />
            <PriceCardContent type="month" />
          </Tab>
        </Tabs>

        <span
          aria-hidden="true"
          className="w-px h-px block"
          style={{ marginLeft: "0.25rem", marginTop: "3rem" }}
        />
        <div className="flex py-2">
          <p className="text-default-400">
            運営費用または負担が多くなった場合有料プランが公開される可能性があります。
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroPricingContent;
