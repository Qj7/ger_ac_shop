export function parsePagination(page?: string, limit?: string, maxLimit = 100) {
  const p = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
  const l = Math.min(maxLimit, Math.max(1, Number.parseInt(limit ?? '20', 10) || 20));
  return { page: p, pageSize: l, skip: (p - 1) * l, take: l };
}
