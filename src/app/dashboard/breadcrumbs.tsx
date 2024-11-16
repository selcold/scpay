"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Breadcrumbs() {
  const pathname = usePathname();

  // パスを "/" で分割して breadcrumb 配列を生成
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumb = pathSegments.map((segment, index) => {
    const url = "/" + pathSegments.slice(0, index + 1).join("/");
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      url,
    };
  });

  // ホームを追加する
  breadcrumb.unshift({
    label: "ScPay",
    url: "/",
  });
  return (
    <Breadcrumb>
      <BreadcrumbList className="">
        {breadcrumb.map((item, index) => {
          if (breadcrumb.length > index + 1) {
            function Item() {
              return (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.url}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              );
            }
            return <Item key={index} />;
          }
          return (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
