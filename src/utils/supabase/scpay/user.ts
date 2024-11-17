// "use server";

// import { getCookie } from "cookies-next/server";
// import { ScPayUserType } from "../scpay";

// type Response = {
//   ok: boolean;
//   message: string;
//   user?: ScPayUserType;
// };

// export async function getScPayUser(): Promise<Response> {
//   const token = getCookie("scpay-account-token");
//   if (!token) {
//     return {
//       ok: false,
//       message: "認証情報が見つかりません",
//     };
//   }

//   const response = await fetch("/api/scpay/me", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     return {
//       ok: false,
//       message: "ユーザー情報の取得に失敗しました",
//     };
//   } else {
//     const data = await response.json();
//     return {
//       ok: false,
//       message: "ユーザー情報の取得に成功しました",
//       user: data.user,
//     };
//   }
// }
