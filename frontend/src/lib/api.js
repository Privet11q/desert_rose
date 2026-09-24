import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (
      response?.status === 401 &&
      config &&
      !config._retry &&
      !config.url?.startsWith("/auth/")
    ) {
      config._retry = true;
      try {
        refreshing = refreshing || api.post("/auth/refresh");
        await refreshing;
        refreshing = null;
        return api(config);
      } catch (e) {
        refreshing = null;
      }
    }
    return Promise.reject(error);
  }
);

export function apiError(err) {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
