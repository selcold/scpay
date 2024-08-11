import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface DocsLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  className?: string;
  href: string;
}

function DocsLink({ children, className, href, ...props }: DocsLinkProps) {
  return (
    <Link
      className={cn("text-blue-500 dark:text-sky-500 hover:underline hover:decoration-blue-500 dark:hover:decoration-sky-500", className)}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}

export default DocsLink;
