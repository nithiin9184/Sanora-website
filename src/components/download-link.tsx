import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { getDownloadCount, recordDownload } from "@/lib/downloads.functions";
import { APK_URL, INITIAL_DOWNLOADS, formatDownloads } from "@/lib/downloads";

export function DownloadLink({ children, className, showCount = false }: { children: ReactNode; className?: string; showCount?: boolean }) {
  const queryClient = useQueryClient();
  const record = useServerFn(recordDownload);
  const [busy, setBusy] = useState(false);
  const { data: count = INITIAL_DOWNLOADS } = useQuery({
    queryKey: ["apk-download-count"], queryFn: () => getDownloadCount(),
    refetchInterval: 30_000, staleTime: 10_000,
  });
  const track = () => {
    if (busy) return;
    setBusy(true);
    void record({ data: { eventId: crypto.randomUUID() } })
      .then((total) => queryClient.setQueryData(["apk-download-count"], total))
      .catch(() => { /* Tracking must never block the APK link. */ })
      .finally(() => setBusy(false));
  };
  return <>
    {showCount && <p aria-live="polite" className="mt-7 text-xs font-medium text-muted-foreground">{formatDownloads(count)} downloads</p>}
    <a href={APK_URL} download="sanora.apk" rel="noopener" className={className} onClick={track}>{children}</a>
  </>;
}
