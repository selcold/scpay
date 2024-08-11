"use client";

import React from "react";
import { TLink } from "@/components/ui/Tcomps";
import { useSearchParams } from "next/navigation";

function CloseDocsButton() {
  const searchParams = useSearchParams();
  const requrl = searchParams.get("requrl");

  return (
    <>
      {requrl ? (
        <div className="w-full border-b border-neutral-500 pb-2 mb-3">
          {requrl === "close" ? (
            <button onClick={() => window.close()}>閉じる</button>
          ) : (
            <TLink to={requrl} i18n_link>
              閉じる
            </TLink>
          )}
        </div>
      ) : (
        <div className="w-full pb-2 mb-3" />
      )}
    </>
  );
}

export default CloseDocsButton;
