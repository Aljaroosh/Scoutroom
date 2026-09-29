import { ApiError, contentApi } from "./api";
import type { ContentResult, MembershipLevel } from "../types";


export async function getContent(slug: string): Promise<ContentResult> {
  try {
    const res = await contentApi.getBySlug(slug);
    return { status: "ok", page: res.page };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) return { status: "login-required" };
      if (error.status === 404) return { status: "not-found" };

      if (error.status === 403) {
        const data = error.data as { requiredLevel?: MembershipLevel };
        if (data.requiredLevel) {
          return { status: "upgrade-required", requiredLevel: data.requiredLevel };
        }
      }
    }
    throw error;
  }
}