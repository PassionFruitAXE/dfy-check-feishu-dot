export const baseResponse = <T = null>(props?: {
  data?: T | null;
  code?: number | null;
  msg?: string | null;
}): string =>
  JSON.stringify({
    code: props?.code ?? 200,
    msg: props?.msg ?? null,
    data: props?.data ?? null,
  });
