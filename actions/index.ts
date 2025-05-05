"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("authToken", token, { maxAge: 60 * 60 * 24 * 90 });
}

export async function deleteAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
}
