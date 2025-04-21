import { addToast } from "@heroui/toast";

export default async function api(
  url: string,
  method: "GET" | "POST",
  body?: any
): Promise<{ ok: boolean; data: any }> {
  try {
    const authToken = localStorage.getItem("authToken");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const options: RequestInit = {
      method: method,
      headers: headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      options
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "خطایی پیش آمده دوباره تلاش کنید");
    }

    return { ok: true, data };
  } catch (error: any) {
    addToast({
      title: "خطا",
      description: error?.message || "خطایی پیش آمده دوباره تلاش کنید",
      color: "danger",
    });

    return { ok: false, data: null };
  }
}
