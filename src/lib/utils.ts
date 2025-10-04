import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never

type PathParams<T extends string> = {
  [K in ExtractPathParams<T>]: string | number | boolean
}

export function buildUrl<T extends string>(
  url: T,
  params: T extends `${string}:${string}`
    ? { paths: PathParams<T>; query?: Record<string, unknown> }
    : { paths?: PathParams<T>; query?: Record<string, unknown> },
): string {
  let baseUrl: string = url

  if (params.paths) {
    baseUrl = Object.entries(params.paths).reduce(
      (path, [parameter, value]) =>
        path.replace(`:${parameter}`, String(value)),
      baseUrl,
    )
  }

  if (params.query) {
    const query = Object.entries(params.query)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    baseUrl = `${baseUrl}?${query}`
  }

  return baseUrl
}
