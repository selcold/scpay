import { cn } from "@/lib/utils";
import React, { HTMLAttributes, HtmlHTMLAttributes } from "react";

interface CustomCardProps extends HtmlHTMLAttributes<HTMLDivElement> {}
const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col w-full h-full", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CustomCard.displayName = "CustomCard";

interface CustomCardHeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {}
const CustomCardHeader = React.forwardRef<
  HTMLDivElement,
  CustomCardHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col mb-5", className)} {...props}>
      {children}
    </div>
  );
});
CustomCardHeader.displayName = "CustomCardHeader";

interface CustomCardBodyProps extends HtmlHTMLAttributes<HTMLDivElement> {}
const CustomCardBody = React.forwardRef<HTMLDivElement, CustomCardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center w-full mb-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CustomCardBody.displayName = "CustomCardBody";

interface CustomCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
const CustomCardTitle = React.forwardRef<
  HTMLHeadingElement,
  CustomCardTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <h1 ref={ref} className={cn("text-xl", className)} {...props}>
      {children}
    </h1>
  );
});
CustomCardTitle.displayName = "CustomCardTitle";

interface CustomCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}
const CustomCardDescription = React.forwardRef<
  HTMLParagraphElement,
  CustomCardDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-foreground-500", className)}
      {...props}
    >
      {children}
    </p>
  );
});
CustomCardDescription.displayName = "CustomCardDescription";

export {
  CustomCard,
  CustomCardHeader,
  CustomCardBody,
  CustomCardTitle,
  CustomCardDescription,
};
