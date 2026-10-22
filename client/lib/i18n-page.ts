"use client";

import type { Language } from "@/lib/i18n";

// Per-page translation dictionaries. Each page module exports
// { en, hi, bn, ta, te } where every branch mirrors the same nested shape.
export type PageDict = Record<string, unknown>;

function resolvePath(dict: PageDict, keyPath: string): string | undefined {
  if (!keyPath) return undefined;
  const parts = keyPath.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, key) =>
    vars[key] !== undefined ? String(vars[key]) : match
  );
}

export interface PageT {
  (keyPath: string, vars?: Record<string, string | number>): string;
  [key: string]: unknown;
}

/**
 * Builds a translator bound to a single page's 5-language dictionary.
 * Missing keys fall back to English, then to the key path itself.
 */
export function makePageT(language: Language, pageDict: Record<Language, PageDict> | PageDict): PageT {
  const dict: PageDict =
    language in pageDict ? (pageDict as Record<Language, PageDict>)[language] : (pageDict as PageDict);
  const fallback: PageDict = ((pageDict as Record<Language, PageDict>).en ??
    (pageDict as PageDict)) as PageDict;

  const fn = function (keyPath: string, vars?: Record<string, string | number>): string {
    const val = resolvePath(dict, keyPath);
    if (val !== undefined) return interpolate(val, vars);
    const fb = resolvePath(fallback, keyPath);
    if (fb !== undefined) return interpolate(fb, vars);
    return keyPath;
  };

  return new Proxy(fn, {
    get(target, prop) {
      if (typeof prop === "symbol") return (target as unknown as Record<symbol, unknown>)[prop];
      if (prop in target) return (target as unknown as Record<string, unknown>)[prop];
      return dict[prop] !== undefined ? dict[prop] : fallback[prop];
    },
  }) as PageT;
}