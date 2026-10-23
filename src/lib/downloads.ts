export const INITIAL_DOWNLOADS = 10_200;

export function downloadTotal(newDownloads: number) {
  return INITIAL_DOWNLOADS + Math.max(0, Math.floor(newDownloads));
}

export function formatDownloads(total: number) {
  return total === INITIAL_DOWNLOADS ? "10.2k" : total.toLocaleString("en-US");
}
export const APK_URL = "https://kiisrtoqmrrwqljaafjq.supabase.co/storage/v1/object/public/release/app-debug.apk";
