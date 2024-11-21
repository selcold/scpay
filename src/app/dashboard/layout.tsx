import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/sidebar/app";
import { ScPayUserProvider } from "@/hooks/useScPayUser";
import Breadcrumbs from "./breadcrumbs";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TopNewsContent } from "@/components/nav/news";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s |  ScPay`,
      default: `Dashboard`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScPayUserProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNewsContent />
          <header className="flex h-16 justify-start items-center gap-2 container pl-0 ml-0">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Suspense
                fallback={
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <Skeleton className="flex w-11 max-w-lg h-4 rounded-md" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <Skeleton className="flex w-11 max-w-lg h-4 rounded-md" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <Skeleton className="flex w-11 max-w-lg h-4 rounded-md" />
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                }
              >
                <Breadcrumbs />
              </Suspense>
            </div>
          </header>
          <main className="container flex flex-col items-start px-8 ml-0 mr-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ScPayUserProvider>
  );
}
