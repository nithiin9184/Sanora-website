import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { z } from "zod";
import { INITIAL_DOWNLOADS } from "./downloads";

function publicClient() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("Download service unavailable");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

export const getDownloadCount = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await publicClient().rpc("get_apk_download_count");
    if (error || data == null) return INITIAL_DOWNLOADS;
    return Number(data);
  } catch {
    return INITIAL_DOWNLOADS;
  }
});

export const recordDownload = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ eventId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: count, error } = await publicClient().rpc("record_apk_download", { p_event_id: data.eventId });
    if (error) throw new Error("Couldn't update downloads");
    return Number(count);
  });