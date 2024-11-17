import React from "react";
import { deleteCookie } from "cookies-next/server";
import { redirect } from "next/navigation";

function LogoutPage() {
  deleteCookie("scpay-account-token");
  redirect("/login");
}

export default LogoutPage;
