"use clinet";

import { useScPayUser } from "@/hooks/useScPayUser";
import { ScPayUserType } from "@/utils/supabase/scpay";
import React, { createContext, ReactNode } from "react";

interface UserContextType {
  user: ScPayUserType | null;
}

const ScPayAdminProviderContext = createContext<UserContextType | undefined>(
  undefined
);
export const ScPayAdminProviderContent = ({
  children,
  Loading: LoadingComponent,
  Error: ErrorComponent,
  noAdmin: NoAdminComponent,
}: {
  children: ReactNode;
  Loading?: React.ElementType;
  Error?: React.ElementType;
  noAdmin?: ReactNode;
}) => {
  const { user, loading, error } = useScPayUser();

  if (loading) {
    return LoadingComponent ? <LoadingComponent /> : <></>;
  }

  if (!user?.admin) {
    if (NoAdminComponent) return <>{NoAdminComponent}</>;
    return null;
  }

  if (error) {
    console.warn(error);
    return ErrorComponent ? (
      <ErrorComponent />
    ) : (
      <div className="flex justify-center items-center w-full h-full">
        エラーが発生しました
      </div>
    );
  }

  return (
    <ScPayAdminProviderContext.Provider value={{ user }}>
      {children}
    </ScPayAdminProviderContext.Provider>
  );
};
