import React from "react";
import { cn } from "@/lib/utils";

export interface TextContentGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}
const TextContentGroup = React.forwardRef<
  HTMLDivElement,
  TextContentGroupProps
>(({ children, className, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col w-full", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
TextContentGroup.displayName = "TextContentGroup";

export interface TextContentGroupHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}
const TextContentGroupHeader = React.forwardRef<
  HTMLDivElement,
  TextContentGroupHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <div className={cn("mb-3", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
TextContentGroupHeader.displayName = "TextContentGroupHeader";

export interface TextContentGroupTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}
const TextContentGroupTitle = React.forwardRef<
  HTMLHeadingElement,
  TextContentGroupTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <h1
      className={cn("font-bold text-2xl mb-3", className)}
      ref={ref}
      {...props}
    >
      {children}
    </h1>
  );
});
TextContentGroupTitle.displayName = "TextContentGroupTitle";

export interface TextContentGroupBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {}
const TextContentGroupBody = React.forwardRef<
  HTMLDivElement,
  TextContentGroupBodyProps
>(({ children, className, ...props }, ref) => {
  return (
    <div className={cn("mb-5", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
TextContentGroupBody.displayName = "TextContentGroupBody";

export interface TextContentTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}
const TextContentTitle = React.forwardRef<
  HTMLHeadingElement,
  TextContentTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <h2
      className={cn("font-bold text-xl mb-1", className)}
      ref={ref}
      {...props}
    >
      {children}
    </h2>
  );
});
TextContentTitle.displayName = "TextContentTitle";

export interface TextContentDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
const TextContentDescription = React.forwardRef<
  HTMLParagraphElement,
  TextContentDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <p className={cn("text-sm mb-2", className)} ref={ref} {...props}>
      {children}
    </p>
  );
});
TextContentDescription.displayName = "TextContentDescription";

export {
  TextContentGroup,
  TextContentGroupTitle,
  TextContentGroupHeader,
  TextContentGroupBody,
  TextContentTitle,
  TextContentDescription,
};
