import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const REVIEWS_PER_PAGE = 6;

export function reviewPageRange(page: number) {
  const start = (Math.max(1, Math.floor(page)) - 1) * REVIEWS_PER_PAGE;
  return { start, end: start + REVIEWS_PER_PAGE - 1 };
}

export function reviewPageCount(total: number) {
  return Math.ceil(Math.max(0, total) / REVIEWS_PER_PAGE);
}

export const reviewsQueryOptions = (page: number) => queryOptions({
  queryKey: ["reviews", page],
  queryFn: async () => {
    const { start, end } = reviewPageRange(page);
    const { data, count, error } = await supabase.from("reviews")
      .select("id, name, rating, text", { count: "exact" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(start, end);
    if (error) throw error;
    return { reviews: data ?? [], total: count ?? 0 };
  },
});