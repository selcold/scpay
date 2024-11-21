"use server";

interface ReqScPayAPIProps extends RequestInit {
  url: string;
}

interface ReqScPayAPIResponseProps extends Response {
  ok: boolean;
  message?: string;
  error?: string;
  error_message?: string;
  data?: any;
}

export async function reqScPayAPI(
  req: ReqScPayAPIProps
): Promise<ReqScPayAPIResponseProps> {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const fetchURL = `${baseUrl}${req.url}`;
  const response = await fetch(fetchURL, {
    ...req,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${process.env.SCPAY_SECRET_KEY}`,
    },
  });
  const res = await response.json();
  return res;
}

export async function getScPayAlldata(from: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/scpay/all?from=${from}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SCPAY_SECRET_KEY}`,
    },
  });
  const res = await response.json();
  return res;
}
